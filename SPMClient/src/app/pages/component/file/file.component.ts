import { Component, OnInit, Input, ViewChild, ElementRef, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../../../service/service'
import { Folder } from '../../../../app/service/model/folder'
import { Repo } from '../../../service/model/repo';

import { exportIsLogged } from '../../starter/starter.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})


export class FileComponent implements OnInit {

  @ViewChild("closeModal1") closeModal : ElementRef 
  @ViewChild("closeModal15") closeModal1 : ElementRef

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
  lastVersion: any
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

  constructor(public router: Router, private formBuilder:FormBuilder, private service: Service, private route: ActivatedRoute) {
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
      this.service.moveToFolder(this.idFile,id,this.idUser,this.file.path)
      .subscribe(data => {
        this.message="file spostato nella repository"
       // this.router.navigate(['/repositoryID',id])
      }, error => {
        this.errorMessage = <any>error
      });

    }else{
      if(id == this.idFolder){
        this.message="selezionare una cartella diversa dall\'originale"
      }else{
        this.service.moveToFolder(this.idFile,this.idRepoSelected,this.idUser,this.file.path,id)
        .subscribe(data => {
         this.message="file spostato nella folder selezionata"
         
         setTimeout(()=>{
          this.clearModal(),this.go()}, 2000); 
        //  document.getElementById("myModalModifyPath").setAttribute("class","custom-close")
          
         // this.router.navigate(['/repositoryID',this.idRepoSelected,'folderID',id])
        }, error => {
          this.errorMessage = <any>error
        });
    }
  }
  this.getFileSpec()
}
else {
  alert('stai cercando di taroccare il sistema.')
  this.router.navigate(['']);
}
this.spostaButton=false;
this.sposta=null;
}

//how to close a modal
clearModal():any{
this.closeModal.nativeElement.click()

}

clearModal1():any{
  this.closeModal1.nativeElement.click()
  }

go(){
  this.router.navigate(['/repositoryID',this.idRepoSelected,'folderID',this.idMoment])
}


  deleteVersion(v) {
    this.vers = v
    if (this.vers == null) {
      alert("seleziona una versione per eliminarla!")
    }
    else {
      this.cambia=false
      alert("versione eliminata con successo")
      this.service.deleteVersion(this.idFile, this.vers)
        .subscribe(data => {
          var index = this.finalVersion.indexOf(this.vers);
          if (index > -1) {
            this.finalVersion.splice(index, 1);
          }
          this.vers = null
          this.cambia=false
          this.getFileSpec()

        }, error => {
          console.log(error);
        });
    }
  }


  ngOnInit() {
    this.modifyNameForm=this.formBuilder.group({
      reponame:['',Validators.required]
    
    });
    this.shareFileForm=this.formBuilder.group({
      reponame:['',Validators.required],
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
          console.log(this.file)
          for (var i = 0; i < this.file.cVersion; i++) {
            this.versionArray[i] = this.file.cVersion - (this.file.cVersion - i) + 1
          }
          // mi salvo il valore dell'ultima versione corrente
          this.lastVersion = this.file.cVersion

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
        for (var i = 1; i <= data.cVersion; i++) {
          this.versionArray[i - 1] = i
        }
        this.cambia=false
        this.vers=null;
        this.getFileSpec()
        alert("Hai creato una nuova versione del file")
      }, error => {
        this.errorMessage = <any>error
      });
  }

  downloadAllVersion(){
      window.open("http://localhost:8080/api/file/exportCollection?idFile="+this.idFile)
  }

  downloadFile(vers) {
    console.log(vers)
    this.service.downloadFile(this.idFile,vers)
    .subscribe(data => {
     console.log(data)
    
    }, error => {
      this.errorMessage = <any>error
    });

    window.open("http://localhost:8080/api/file/downloadFile?idFile="+this.idFile+"&version="+vers)
    this.cambia=false
    this.vers=null
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
        console.log(this.folderInfo)
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
  shareFiles(){
    this.submitted=false

  }

  modifyFile() {
    this.submitted=false
    this.appearRenameFile = true;
  }


  sendNewFileName(name) {
    this.submitted = true;
    if (this.modifyNameForm.invalid) {
      
      return;
  }
    this.service.changeNameFile(this.idFile, name)
      .subscribe(data => {
        this.appearRenameFile = false
        this.file = data
        this.getFileSpec()
        this.ok=true;
        this.message="Success"
        setTimeout(()=>{this.clearModal1()}, 2000);
      }, error => {
        this.errorMessage = <any>error
      });
  }

  shareFile1() {
    this.share = true
  }

  shareFile(email,nameRepo) {

    this.submitted = true;
    if (this.shareFileForm.invalid) {
      return;
  }
    this.service.shareFile(nameRepo, this.idUser,this.idFile,email)
      .subscribe(data => {
      alert("Email inviata!")
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

}
