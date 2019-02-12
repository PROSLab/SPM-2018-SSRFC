import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modeler, OriginalPropertiesProvider, PropertiesPanelModule, InjectionNames, OriginalPaletteProvider } from "../bpmn-js/bpmn-js";
import { CustomPropsProvider } from '../props-provider/CustomPropsProvider';
import { CustomPaletteProvider } from "../props-provider/CustomPaletteProvider";
import { Service } from '../service/service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';

/* const customModdle = {
  name: "customModdle",
  uri: "http://example.com/custom-moddle",
  prefix: "custom",
  xml: {
    tagAlias: "lowerCase"
  },
  associations: [],
  types: [
    {
      "name": "ExtUserTask",
      "extends": [
        "bpmn:UserTask"
      ],
      "properties": [
        {
          "name": "worklist",
          "isAttr": true,
          "type": "String"
        }
      ]
    },
  ]
}; */

@Component({
  selector: 'app-root',
  templateUrl: './bpmn.component.html',
  styleUrls: ['./bpmn.component.scss']
})
export class BpmnComponent implements OnInit {
  modeler;
  folderSelected: any;
  idRepoSelected: any;
  idUser: string;
  isLogged: any;
  idFile: any;
  file
  idFileCreato: any;
  version: boolean;
  data: any;
  filetoUpload;
  proviamo: any;
  nameFile: any;
  bodyFile: any;
  soundness: string = null;
  safeness: string = null;
  error: any = null;
  TerzoValore: any;
  errorProblem: boolean=null;
  validity: boolean=false;
  appVal: boolean =false;
  title: string;

  constructor(private toastr: ToastrService, private http: HttpClient, private service: Service, public router: Router, route: ActivatedRoute) {
    this.folderSelected = route.snapshot.params.idFolder
    this.idRepoSelected = route.snapshot.params.idRepo
    this.idUser = localStorage.getItem("id")
    this.version = route.snapshot.params.version
    this.isLogged = service.isLogged;
    this.idFile = route.snapshot.params.idFile
  }

  ngOnInit(): void {
    
    if (this.idFile == undefined) {
      this.title="FileInCreazione"
      console.log("lo sto creando")
      this.createFile()
    }
    else {
      this.getFileSpec()
      console.log("lo sto modificando")
      this.load()
    }

    this.modeler = new Modeler({
      container: '#canvas',
      width: '100%',
      height: '500px',
      additionalModules: [
        PropertiesPanelModule,

        // Re-use original bpmn-properties-module, see CustomPropsProvider
        { [InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]] },
        { [InjectionNames.propertiesProvider]: ['type', CustomPropsProvider] },

        // Re-use original palette, see CustomPaletteProvider
        { [InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider] },
        { [InjectionNames.paletteProvider]: ['type', CustomPaletteProvider] },
      ],
      propertiesPanel: {
        parent: '#properties'
      },
     /*  moddleExtension: {
        custom: customModdle
      } */
    });
  }

  handleError(err: any) {
    if (err) {
      console.log("errroreee")
      console.warn('Ups, error: ', err);
    }
  }


  openModal() {

    if (this.idFile == undefined) {
      document.getElementById("saveModal").setAttribute("data-target", "#myModalFile")

    } else {
      document.getElementById("saveModal").setAttribute("data-target", "")
      this.modify()
    }
  }

  getFileSpec() {

    this.service.getFileSpec(this.idFile)
      .subscribe(data => {
        this.file = data
        this.title=this.file.originalName

      }, error => {
      });
  }

  modify(): any {
    
    this.modeler.saveXML(
      (err: any, xml: any) => {
        this.filetoUpload = new File([xml], this.file.originalName)
        this.bodyFile = xml;
      }
    );

    this.service.SaveModificatedFile(this.idUser, this.idRepoSelected, this.idFile, this.version, this.filetoUpload, this.folderSelected)
      .subscribe(data => {
       
      }, error => {
        this.error = error
      });
    this.toastr.success('File modificato Correttamente', 'Modifiche file')
  }

  createFile() {

    const url = '/assets/bpmn/initial.bpmn';
    this.http.get(url, {
      headers: {}, responseType: 'text'
    }).subscribe(
      (x: any) => {
        this.bodyFile = x
        this.modeler.importXML(x, this.handleError)
      },
    );
  }


  load(): void {
   
    const url = "http://localhost:8080/api/file/downloadFile?idFile=" + this.idFile + "&version=" + this.version
    this.http.get(url, {
      headers: {}, responseType: 'text'
    })
      .subscribe(
        async (x: any) => {
          console.log(x)
          this.modeler.importXML(x, this.handleError);
        },
        this.handleError
      );
  }

  headers(url2: string, headers: any, x: string): any {
    throw new Error("Method not implemented.");
  }


  back() {
    if (this.idFile == undefined && this.folderSelected == undefined) {
      this.router.navigate(['repositoryID', this.idRepoSelected]);
    }
    else if (this.folderSelected == undefined) {
      this.router.navigate(['repositoryID', this.idRepoSelected, 'fileID', this.idFile]);
    }
    else if (this.idFile==undefined && this.folderSelected!= undefined){
     this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',this.folderSelected])
    }
    else{
      this.router.navigate(['repositoryID', this.idRepoSelected, 'folderID', this.folderSelected, 'fileID', this.idFile])
    }
  }

  sendTofile(fileSelected) {
    if (this.folderSelected == undefined) {
      this.router.navigate(['repositoryID', this.idRepoSelected, 'fileID', fileSelected]);
    }
    else {
      this.router.navigate(['repositoryID', this.idRepoSelected, 'folderID', this.folderSelected, 'fileID', fileSelected]);
    }
  }

  exportModel() {
    if (this.version == null) {
      this.modeler.saveXML((err: any, xml: any) => this.file = new File([xml], "diagram"));
      saveAs(this.file, "diagram.bpmn")

    } else {
      window.open("http://localhost:8080/api/file/downloadFile?idFile=" + this.idFile + "&version=" + this.version)
      /*  this.downloadFile() */
    }
    this.toastr.success('File scaricato Correttamente', 'Download File')

  }

  CheckValidity() {
    this.modeler.saveXML(
      (err: any, xml: any) => {
        var f = new File([xml], 'diagram');
        this.bodyFile = xml
        console.log(this.bodyFile)
      });

    var headers: { "Content-Type": "application/xml" }
    const url2 = "http://pros.unicam.it:8080/S3/rest/BPMN/Verifier"

    this.http.post(url2, this.bodyFile,
      { headers: headers, responseType: "text" })
      .subscribe(
         async (data: string) => {
    document.getElementById("validation").setAttribute("data-target","#validityModal")
       document.getElementById("validityModal").setAttribute("class", "modal fade show")
      document.getElementById("validityModal").setAttribute("style", "padding-right:16px;display:block")

          this.errorProblem=false
          this.soundness = data.substr(0, 1).trim()
          var pSafeness = data.indexOf('&&') + 4
          this.safeness = data.substr(pSafeness, 1).trim()
          var subData = data.substr(pSafeness + 1)
          var p3Valore = subData.indexOf('&&') + 3
          this.TerzoValore = subData.substr(p3Valore).trim()
          this.toastr.success('Validity and Soundness Verificata', 'Verifica Validity')

          console.log('soundness:', this.soundness, 'safeness:', this.safeness)
           this.setImage(this.soundness,this.safeness)
           
          },
        error => {
          this.errorProblem=true
          document.getElementById("imageSoundness").setAttribute("src","")
        document.getElementById("imageSafeness").setAttribute("src", "")
        document.getElementById("imageSoundness").setAttribute("alt","")
        document.getElementById("imageSafeness").setAttribute("alt", "")
          this.handleError
          this.toastr.error('Invalid bpmn file', 'Errore editor')
          console.log(error);
        });
    }


    close(){
      document.getElementById("validation").setAttribute("data-target","")
      document.getElementById("validityModal").setAttribute("class", "modal fade")
     document.getElementById("validityModal").setAttribute("style", "display:none")
    }

  callToSecondServer() {

    var headers: { "Content-Type": "application/xml" }
    const url2 = "http://pros.unicam.it:8080/S3/rest/BPMN/Verifier"

    this.http.post(url2, this.bodyFile,
      { headers: headers, responseType: "text" })
      .subscribe(

        async (data: string) => {
          this.errorProblem=false
          this.soundness = data.substr(0, 1).trim()
          var pSafeness = data.indexOf('&&') + 4
          this.safeness = data.substr(pSafeness, 1).trim()
          var subData = data.substr(pSafeness + 1)
          var p3Valore = subData.indexOf('&&') + 3
          this.TerzoValore = subData.substr(p3Valore).trim()

          console.log('soundness:', this.soundness, 'safeness:', this.safeness)
          await this.setImage(this.soundness,this.safeness);
       
        },

        error => {
        
          console.log(error);
        }
      );
  }


  save(nameFile) {
    //creazione di un nuovo file salvandolo dall'editor
    this.modeler.saveXML(
      (err: any, xml: any) => {
        console.log(xml)
        this.file = new File([xml], nameFile),
          this.bodyFile = xml
      });

    var autore = localStorage.getItem('name') + ' ' + localStorage.getItem('surname');
    this.service.postFile(this.idRepoSelected, this.idUser, this.file, autore, this.folderSelected)
      .subscribe(data => {
        this.idFileCreato = data.id
        this.addValidity(this.idFileCreato)
        //todo:qui si deve fare qualcosa che ti toglie il programma salvataggio
        this.toastr.success('File creato Correttamente', 'Creazione file')
if(this.folderSelected==undefined){
  this.router.navigate(['repositoryID',this.idRepoSelected])

}else{
  this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',this.folderSelected])
}

      }, error => {
       
		
        console.log(error);
      });

  }

  addValidity(idfile) {
    this.service.addValidity(idfile, this.soundness, this.safeness).subscribe(
      data => { console.log("validity:",data) },
      error => { 
        console.log(error) 
      }
    )
  };

  setImage(soundness,safeness){
    //PARAMETRI PER IL SOUNDNESS
    if(parseInt(soundness)==0) { //0 Unsound for dead token
        document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/RCLhCCGg/unsafe.jpg")
        document.getElementById("imageSoundness").setAttribute("alt", "Unsound for dead token")
    }
    if(parseInt(soundness)==1){  // 1 Unsound for proper completion violation
      document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/RCLhCCGg/unsafe.jpg")
      document.getElementById("imageSoundness").setAttribute("alt", "Unsound for proper completion violation")
    }
    if(parseInt(soundness)==2){ //2 Message disregarding sound
      document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/4ys3vj4v/13878145.jpg")
      document.getElementById("imageSoundness").setAttribute("alt", "Message disregarding sound")
    }

    if(parseInt(soundness)==3){ //3 Sound
      document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/gJdp189m/safe.jpg")
       document.getElementById("imageSoundness").setAttribute("alt", "Sound")
    }

//PARAMETRI PER IL SAFENESS
    if(parseInt(safeness)==4){ //4 Safe
      document.getElementById("imageSafeness").setAttribute("src","https://i.postimg.cc/gJdp189m/safe.jpg")
      document.getElementById("imageSafeness").setAttribute("alt", "Safe")
    }
    if(parseInt(safeness)==5){ // 5 Unsafe
      document.getElementById("imageSafeness").setAttribute("src","https://i.postimg.cc/RCLhCCGg/unsafe.jpg")
      document.getElementById("imageSafeness").setAttribute("alt", "Unsafe")
    }
        
  }

}
