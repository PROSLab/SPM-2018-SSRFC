import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modeler, OriginalPropertiesProvider, PropertiesPanelModule, InjectionNames, OriginalPaletteProvider } from "../bpmn-js/bpmn-js";
import { CustomPropsProvider } from '../props-provider/CustomPropsProvider';
import { CustomPaletteProvider } from "../props-provider/CustomPaletteProvider";
import { Service } from '../service/service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {saveAs} from 'file-saver';  
import { unescapeIdentifier } from '@angular/compiler';

const customModdle = {
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
};

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
  soundness: any;
  safeness: any;
  error: any = null;

  constructor(private toastr:ToastrService,private http: HttpClient, private service: Service, public router: Router, route: ActivatedRoute) {
    this.folderSelected = route.snapshot.params.idFolder
    this.idRepoSelected = route.snapshot.params.idRepo
    this.idUser = localStorage.getItem("id")
    this.version = route.snapshot.params.version
    this.isLogged = service.isLogged;
    this.idFile = route.snapshot.params.idFile
  }

  ngOnInit(): void {
    if (this.idFile == undefined) {
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
      moddleExtension: {
        custom: customModdle
      }
    });
  }

  handleError(err: any) {
    if (err) {
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
      }, error => {
      });
  }

 modify():any{
 this.modeler.saveXML(
   (err: any, xml: any) =>{  
      this.filetoUpload = new File([xml],this.file.originalName)
      this.bodyFile=xml;
    } 
  ); 

  this.service.SaveModificatedFile(this.idUser,this.idRepoSelected,this.idFile,this.version,this.filetoUpload,this.folderSelected)
  .subscribe(data => {
  }, error => {
    this.error=error
  });
    this.toastr.success('File modificato Correttamente', 'Modifiche file')
}

  createFile() {

    const url = '/assets/bpmn/initial.bpmn';
    this.http.get(url, {
      headers: {}, responseType: 'text'
    }).subscribe(
      (x: any) => {
        this.bodyFile=x
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
        async (x:any) => {
          console.log(x)
          this.modeler.importXML(x, this.handleError);
        },
      this.handleError
      );
  }

  headers(url2: string, headers: any, x: string): any {
    throw new Error("Method not implemented.");
  }


 back(){
  if (this.idFile == undefined && this.folderSelected==undefined) {
    this.router.navigate(['repositoryID', this.idRepoSelected]);
  }
  else if (this.folderSelected==undefined) {
    this.router.navigate(['repositoryID', this.idRepoSelected, 'fileID', this.idFile]);
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


 callToSecondServer(){
  
   var headers: {"Content-Type":"application/xml"} 
          const url2 = "http://pros.unicam.it:8080/S3/rest/BPMN/Verifier"

          this.http.post(url2, this.bodyFile,
               {headers:headers,responseType:"text"})
          .subscribe(
              (data: string) => {
                 this.soundness=data.substr(0,1).trim()
                 this.safeness=data.substr(5,5).trim()
                 console.log('soundness:',this.soundness,'safeness:',this.safeness)
              },
            this.handleError
           );    
           
      /*   await   document.getElementById("valModal").setAttribute("data-target", "#validityModal") */
}


  save(nameFile) {
    //creazione di un nuovo file salvandolo dall'editor
    this.modeler.saveXML(
      (err: any, xml: any) =>{
        console.log(xml)
       this.file = new File([xml], nameFile),   
      this.bodyFile=xml});


    var autore = localStorage.getItem('name')+' '+localStorage.getItem('surname'); 
    this.service.postFile(this.idRepoSelected, this.idUser, this.file, autore, this.folderSelected)
      .subscribe( data => {
        this.idFileCreato = data.id
        //this.sendTofile(this.idFile)
        this.toastr.success('File creato Correttamente', 'Creazione file')

      //  await this.sendTofile(this.idFileCreato)
        // do something, if upload success
      }, error => {
        console.log(error);
      });

    /*    setTimeout(() => {
        
       }, 3000); 
    */

  }


}
 