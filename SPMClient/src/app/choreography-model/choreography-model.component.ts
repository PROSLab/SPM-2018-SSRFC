import { Component, OnInit } from '@angular/core';


  import ChoreoModeler from 'chor-js/lib/Modeler';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Service } from '../service/service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-choreography-model',
  templateUrl: './choreography-model.component.html',
  styleUrls: ['./choreography-model.component.css']
})
export class ChoreographyModelComponent implements OnInit {
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
  collaboration: any;
  
 
  constructor(private toastr: ToastrService, private http: HttpClient, private service: Service, public router: Router, route: ActivatedRoute) {
    this.folderSelected = route.snapshot.params.idFolder
    this.idRepoSelected = route.snapshot.params.idRepo
    this.idUser = localStorage.getItem("id")
    this.version = route.snapshot.params.version
    this.isLogged = service.isLogged;
    this.idFile = route.snapshot.params.idFile
  }


  handleError(err: any) {
    if (err) {
      console.log("errore")
      console.warn('Ups, error: ', err);
    }
  }


  ngOnInit() {

    if (this.idFile == undefined) {
      this.title="Creation File"
      console.log("lo sto creando")
      this.createFile()
    }
    else {
      this.getFileSpec()
      console.log("lo sto modificando")
      this.load() 
    }


   this.modeler = new ChoreoModeler({
      container: '#canvas',
      width: '100%',
      height: '1200px',
      keyboard: {
        bindTo: document
      }
    });   
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
      .subscribe( data => {
       // await this.callToSecondServer(this.idFile,this.bodyFile)
        
      }, error => {
        this.error = error
      });
    this.toastr.success('This file has been succesfully modified', 'Modify File')
  }

  createFile() {
  
       const url = '/assets/bpmn/choreographyinitial.bpmn'    
     this.http.get(url, {
      headers: {}, responseType: 'text'
    })
      .subscribe(
        async (xml: any) => {  
          this.modeler.importXML(xml, this.handleError);
         },
        this.handleError
      );  
  }
  
  load(): void {
   
    const url = this.service.baseUrl+"api/file/downloadFile?idFile=" + this.idFile + "&version=" + this.version
    this.http.get(url, {
      headers: {}, responseType: 'text'
    })
      .subscribe(
        async (x: any) => {
          this.modeler.importXML(x, this.handleError);
        },
        this.handleError
      );
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
      window.open(this.service.baseUrl+"api/file/downloadFile?idFile=" + this.idFile + "&version=" + this.version)
    }
    this.toastr.success('File downloaded with success', 'Download File')

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
    this.service.postFile(this.idRepoSelected, this.idUser, this.file, autore, 'choreography', this.folderSelected)
      .subscribe(data => {
        this.idFileCreato = data.id
        //todo:qui si deve fare qualcosa che ti toglie il programma salvataggio
        this.toastr.success('File created', 'Creation File')
if(this.folderSelected==undefined){
  this.router.navigate(['repositoryID',this.idRepoSelected])

}else{
  this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',this.folderSelected])
}

      }, error => {
        console.log(error);
      });

  }
 
}


