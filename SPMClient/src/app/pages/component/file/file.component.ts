import { Component, OnInit, Input, ViewChild, ElementRef, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../../../service/service'
import { Folder } from '../../../../app/service/model/folder'
import { Repo } from '../../../service/model/repo';
import {ToastrService} from 'ngx-toastr'
import {HttpClient} from '@angular/common/http';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})


export class FileComponent implements OnInit {

  @ViewChild("closeModal1") closeModal1 : ElementRef 
  @ViewChild("closeModal2") closeModal2 : ElementRef
  @ViewChild("closeModal3") closeModal3 : ElementRef
  isLogged:boolean
  appearRenameFile: boolean = false;
  fileExist = true;
  fileAppear = false;
  appearFormFolder = false;
  idRepoSelected: string;
  idUser: string;
  userInfo: any;
  folder: Folder = <any>[]
  folderInfo: Folder
  file = <any>[]
  filecreato: File = <any>[];
  errorMessage: any;
  idFolder: string;
  versionArray=<any>[];
  appear: boolean;
  idFile: string;
  folders: any;
  repoInfo: Repo = <any>[]
  vers: any
  sposta:any
  deprecatedVers = []
  lastVersion: any = null
  finalVersion = []
  dataTroncata: string
  versionExist: boolean = false
  repo: any
  cambia=false
  share: boolean=false
  repoName: any
  repoId: any
  spostaButton: boolean=false;
  dataArray: any;
  message: string='';
  idMoment: any;
  ok: boolean;
  modifyNameForm: FormGroup;
  submitted=false;
  shareFileForm: FormGroup;
  reset: string='';
  secondButton: boolean=null;
  ok2: boolean;

  constructor(private toastr:ToastrService,public router: Router, private http: HttpClient, private formBuilder:FormBuilder, private service: Service, private route: ActivatedRoute) {
    this.idRepoSelected = route.snapshot.params.idRepo
    this.idUser = localStorage.getItem("id")
    this.idFolder = route.snapshot.params.idFolder
    this.idFile = route.snapshot.params.idFile
    this.isLogged=service.isLogged;
  }


  selected() {
    this.cambia=true
  }


  selectedSposta() {
    this.spostaButton=true
  }

moveTo(id){
  this.idMoment=id
  if(id !=null){
    if(id==this.idRepoSelected){
      this.service.moveToFolder(this.idFile,this.idRepoSelected,this.idUser,this.file.path,this.idFolder)
      .subscribe(data => {
        this.toastr.success('File spostato nella cartella di destinazione', 'Move File')

      }, error => {
        this.errorMessage = <any>error
      });

    }else{
      if(id == this.idFolder){
        this.ok2=true
        this.toastr.warning('Selezionare una cartella diversa dall origine', 'Folder')

      }else{
        this.service.moveToFolder(this.idFile,this.idRepoSelected,this.idUser,this.file.path,id)
        .subscribe(data => {
         this.clearModal(this.closeModal1)
         setTimeout(()=>{
          this.go()}, 2000); 
        }, error => {
          this.errorMessage = <any>error
        });
    }
  }
  this.getFileSpec()
}
else {
  this.router.navigate(['']);
}
this.spostaButton=false;
this.sposta=null;
}

//how to close a modal
clearModal(modal):any{
modal.nativeElement.click()
}

go(){
  this.router.navigate(['/repositoryID',this.idRepoSelected,'folderID',this.idMoment])
}


deleteFile(){
  console.log(this.idFolder)
 this.service.deleteFile(this.idFile,this.idRepoSelected,this.idUser,this.idFolder)
 .subscribe(data=>{
   //this.ok=true
   this.toastr.success('File eliminato con successo', 'File Eliminato')

  
  
  setTimeout(()=>{
    if (this.idFolder==undefined){
     // document.getElementById("deleteFileVersion").setAttribute("data-target","")
     // this.ok=false
    
      this.sendToRepo()
    }else{
     // document.getElementById("deleteFileVersion").setAttribute("data-target","")
     // this.ok=false
 
      this.sendTofolder()
    }}, 3000); 
 },
error => {
  this.errorMessage = <any>error
});
}


//da fixare
/* checkDeleted(v){
  if(this.finalVersion.length==1){
    console.log("sto eliminando l'ultima versione, quindi chiedo se veramente voglio eliminare il file o no")
    
  }
  else{
  
    this.deleteVersion(v)
  }
} */

  deleteVersion(v) {
   
    this.vers = v
    if (this.vers == null) {
      this.toastr.warning('Devi selezionare una versione per eliminarla', 'Versione File')

    }
    else if (this.finalVersion.length !=1) {
      document.getElementById("buttonDelete").setAttribute("data-target","")

      this.service.deleteVersion(this.idFile, this.vers)
        .subscribe(data => {
          data = JSON.parse(data)
          var index = this.finalVersion.indexOf(this.vers);
          if (index > -1) {
            this.finalVersion.splice(index, 1);
          }
        this.vers =null
        
        this.toastr.success('Versione Eliminata con successo', 'Versione Eliminata')
        
         
          this.getFileSpec()
        }, error => {
          console.log(error);
        });
    }else{
      document.getElementById("buttonDelete").setAttribute("data-target","#myModalDeleteFile")
    }
  }


  ngOnInit() {
    
    this.modifyNameForm=this.formBuilder.group({
      reponame:['',Validators.required]
    
    });
    this.shareFileForm=this.formBuilder.group({
      email:['',[Validators.required,Validators.email]]
    })
   
    this.cambia=false
    this.getFileSpec()
    if(this.idFolder != null){
      this.getFolder()
    }
    this.getRepo()
    this.getAllFolders()
  }


  

  get f() { 
   
    return this.modifyNameForm.controls;
   }

  get g() {

  return this.shareFileForm.controls;
  }

  troncaData(data: String) {
    return this.dataTroncata = data.substr(0, 10)
  }

  getFileSpec() {
    
    console.log("entra")
    this.cambia=false
    for (var i = 0; i < this.versionArray.length; i++) {
      this.versionArray[i] = null
    }
    this.service.getFileSpec(this.idFile)
      .subscribe(data => {
        console.log(data)

        if (data != null) {

          data.createdAt = this.troncaData(data.createdAt)
          this.fileExist = true;
          this.file = (data)
          for (var i = 0; i < this.file.cVersion; i++) {
            this.versionArray[i] = this.file.cVersion - (this.file.cVersion - i) + 1
          }

          this.versionExist=true
          //mi salvo le versioni deprecate
          for (var i = 0; i < this.file.deletedVersions.length; i++) {
            this.deprecatedVers[i] = this.file.deletedVersions[i]
          }

          var j = 0;
          for (i = 0; i < this.versionArray.length; i++) {
            if (this.deprecatedVers.indexOf(this.versionArray[i]) == -1) {
              this.finalVersion[j] = this.versionArray[i]
              j++
            }
          }

          //lunghezza dell'array delle versioni non deprecate
          var length = this.finalVersion.length

          // mi salvo il valore dell'ultima versione corrente per stamparla poi  nel dropdown
          this.vers=this.finalVersion[length-1]
          console.log(this.vers)
          if (this.finalVersion.length > 0) {
            this.versionExist = true;
          }
          else {
            this.versionExist = false;
          }
        }

        else {
          this.fileExist = false;
        }
      }, error => {
        this.errorMessage = <any>error
      });
  }


  newVersion() {
    this.service.createNewVersion(this.idFile, this.file.cVersion)
      .subscribe(data => {
       data = JSON.parse(data)

        for (var i = 1; i <= data.cVersion; i++) {
          this.versionArray[i - 1] = i
        }
        this.cambia=false
        this.vers=data.cVersion;
        this.toastr.success('Nuova versione del file creata con successo', 'Versione File')
        this.getFileSpec()
      }, error => {
        this.errorMessage = <any>error
      });
  }

  downloadAllVersion(){
      window.open("http://localhost:8080/api/file/exportCollection?idFile="+this.idFile)
  }


  createFile() {
    this.fileAppear = true;
  }

  modifyRepo() {
    this.appear = true;
  }

  saveFile(originalName) {
    this.service.createFile(this.idRepoSelected, this.idFolder, this.idUser, originalName)
      .subscribe(data => {
        this.fileAppear = false;
        this.fileExist = true;
        this.file = JSON.parse(data)
        this.versionArray[0] = 1

      }, error => {
        this.errorMessage = <any>error
      });
  }


  back() {
    if(this.idFolder !=null){
      this.router.navigate(['repositoryID/',this.idRepoSelected,'folderID',this.idFolder]);
    }else {
      this.router.navigate(['repositoryID/',this.idRepoSelected,]);
    }
  }

  //premdo i dati specifici di quel file che ho selezionato in precedenza


  getFolder() {
    this.service.getFolderSpec(this.idFolder)
      .subscribe(data => {
        data.createdAt = this.troncaData(data.createdAt)
        this.folderInfo = data
      }, error => {
        this.errorMessage = <any>error
      });
  }

  getAllFolders() {
    this.service.getAllFolder(this.idRepoSelected)
      .subscribe(data => {
        data = JSON.parse(data)
        this.folders = data
      }, error => {
        this.errorMessage = <any>error
      });
  }


  getRepo() {
    this.service.getRepoSpec(this.idRepoSelected)
      .subscribe(data => {
        data.createdAt = this.troncaData(data.createdAt)
        this.repo = data
      }, error => {
        this.errorMessage = <any>error
      });
  }



  modifyFile() {
    this.submitted=false
    this.reset = ''
  }


  sendNewFileName(name) {
    this.submitted = true;
    if (this.modifyNameForm.invalid) {
      return;
  }
    this.service.changeNameFile(this.idFile, name)
      .subscribe(data => {
        this.file = data
        this.getFileSpec()
        this.toastr.success('Nome  del file modificato con successo', 'Name File')

        this.submitted=false
        this.clearModal(this.closeModal3)
        

       
      }, error => {
        this.errorMessage = <any>error
      });
  }


  shareFile(email,nameRepo) {

    this.submitted = true;
    if (this.shareFileForm.invalid) {
      console.log("invalid")
      return;
  }
  
    this.service.shareFile(nameRepo, this.idUser,this.idFile,email)
      .subscribe(data => {
        this.ok=true
        this.toastr.success('File condiviso con successo', 'Share File')

         this.clearModal(this.closeModal2)
        
       
        this.share = false
      }, error => {
        alert("ERRORE! Invio email non riuscito")
        this.errorMessage = <any>error
      })
  }

  sendToEditor(v) {
    if(this.idFolder==undefined){
      this.router.navigate(['repositoryID',this.idRepoSelected,'fileID',this.idFile,'editorBPMN',v]);
    }else{
      this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',this.idFolder,'fileID',this.idFile,'editorBPMN',v]);

    }
   
   

  }
  sendToRepoFold() {
    this.router.navigate(['']);

  }
  sendToRepo() {
    this.router.navigate(['repositoryID', this.idRepoSelected]);

  }

  sendTofolder() {
    this.router.navigate(['repositoryID', this.idRepoSelected, 'folderID', this.idFolder]);
  }

}
