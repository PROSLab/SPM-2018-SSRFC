import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modeler, OriginalPropertiesProvider, PropertiesPanelModule, InjectionNames, OriginalPaletteProvider } from "../bpmn-js/bpmn-js";
import { CustomPropsProvider } from '../props-provider/CustomPropsProvider';
import { CustomPaletteProvider } from "../props-provider/CustomPaletteProvider";
import { Service } from '../service/service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';


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
  messageSoundness: any;
  messageSafeness: string;

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
      .subscribe(async data => {
        await this.callToSecondServer(this.idFile,this.bodyFile)

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
    console.log('repositoryID', this.idRepoSelected, 'folderID', this.folderSelected, 'fileID', this.idFile)
    if (this.folderSelected == undefined) {
      this.router.navigate(['repositoryID', this.idRepoSelected, 'fileID', this.idFile]);
    }
    else {
      this.router.navigate(['repositoryID', this.idRepoSelected, 'folderID', this.folderSelected, 'fileID', this.idFile]);
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
    this.toastr.success('File downloaded with success', 'Download File')

  }

  CheckSoundnessAndSafeness() {
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
          this.validity=true
          this.errorProblem=false
          this.soundness = data.substr(0, 1).trim()
          var pSafeness = data.indexOf('&&') + 4
          this.safeness = data.substr(pSafeness, 1).trim()
          var subData = data.substr(pSafeness + 1)
          var p3Valore = subData.indexOf('&&') + 3
          this.TerzoValore = subData.substr(p3Valore).trim()
          this.toastr.success('Validity and Soundness verificated', 'Verifica Validity')

          console.log('soundness:', this.soundness, 'safeness:', this.safeness)
           this.setImage(this.soundness,this.safeness)

           if( this.idFile!= undefined){
            this.addValidity( this.idFile)
           }
          },
        error => {         

          this.errorProblem=true
          document.getElementById("imageSoundness").setAttribute("src","")
        document.getElementById("imageSafeness").setAttribute("src", "")
        document.getElementById("imageSoundness").setAttribute("alt","")
        document.getElementById("imageSafeness").setAttribute("alt", "")
          this.handleError
          this.toastr.error('Invalid bpmn file', 'Errore editor')
          this.safeness=null
          this.soundness=null
          this.validity=false
          if( this.idFile!= undefined){
            this.addValidity( this.idFile)
           }   
          console.log(error);
        });
    }


    close(){
      document.getElementById("validation").setAttribute("data-target","")
      document.getElementById("validityModal").setAttribute("class", "modal fade")
     document.getElementById("validityModal").setAttribute("style", "display:none")
    }



    callToSecondServer(idfile?,newXml?) {

      this.modeler.saveXML(
        (err: any, xml: any) => {
          var f = new File([xml], 'diagram');
          newXml = xml
          console.log(this.bodyFile)
        });

    var headers: { "Content-Type": "application/xml" }
    const url2 = "http://pros.unicam.it:8080/S3/rest/BPMN/Verifier"

    this.http.post(url2, newXml,
      { headers: headers, responseType: "text" })
      .subscribe(

        async (data: string) => {
          this.errorProblem=false
         /*  this.soundness = data.substr(0, 1).trim()
          var pSafeness = data.indexOf('&&') + 4
          this.safeness = data.substr(pSafeness, 1).trim()
          var subData = data.substr(pSafeness + 1) */
          this.safeness=null
          this.soundness=null
          this.validity=true
          if( this.idFile!= undefined){
            this.addValidity(this.idFile)
           }  
          this.toastr.success('This model is valid','Validity of Model')
        },
        error => {
          this.safeness=null
          this.soundness=null
          this.validity=false

          if( this.idFile!= undefined){
            this.addValidity( this.idFile)
           }   

        this.toastr.error('This model is invalid','Validity Model')
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
        //todo:qui si deve fare qualcosa che ti toglie il programma salvataggio
        this.toastr.success('File created', 'Creazione file')
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
    if(this.isLogged==true){
    this.service.addValidity(idfile, this.soundness, this.safeness,this.validity).subscribe(
      data => { console.log("validity:",data) },
      error => { 
        console.log(error) 
      }
      )
    }
  };

  setImage(soundness,safeness){
    //PARAMETRI PER IL SOUNDNESS
    if(parseInt(soundness)==0) { //0 Unsound for dead token
        document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/RCLhCCGg/unsafe.jpg")
        document.getElementById("imageSoundness").setAttribute("alt", "Unsound for dead token")
        this.messageSoundness = " Unsound for dead token "
      }
    if(parseInt(soundness)==1){  // 1 Unsound for proper completion violation
      document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/RCLhCCGg/unsafe.jpg")
      document.getElementById("imageSoundness").setAttribute("alt", "Unsound for proper completion violation")
      this.messageSoundness = " Unsound for proper completion violation "
    }
    if(parseInt(soundness)==2){ //2 Message disregarding sound
      document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/4ys3vj4v/13878145.jpg")
      document.getElementById("imageSoundness").setAttribute("alt", "Message disregarding sound")
      this.messageSoundness = " Message disregarding sound "
    }

    if(parseInt(soundness)==3){ //3 Sound
      document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/gJdp189m/safe.jpg")
       document.getElementById("imageSoundness").setAttribute("alt", "Sound")
       this.messageSoundness = " Sound "
      }

//PARAMETRI PER IL SAFENESS
    if(parseInt(safeness)==4){ //4 Safe
      document.getElementById("imageSafeness").setAttribute("src","https://i.postimg.cc/gJdp189m/safe.jpg")
      document.getElementById("imageSafeness").setAttribute("alt", "Safe")
      this.messageSafeness = " Safe "
    }
    if(parseInt(safeness)==5){ // 5 Unsafe
      document.getElementById("imageSafeness").setAttribute("src","https://i.postimg.cc/RCLhCCGg/unsafe.jpg")
      document.getElementById("imageSafeness").setAttribute("alt", "Unsafe")
      this.messageSafeness = " Unsafe "
    }
        
  }




  

}
