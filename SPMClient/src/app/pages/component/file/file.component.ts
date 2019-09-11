import { Component, OnInit, Input, ViewChild, ElementRef, AfterContentInit, OnDestroy, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../../../service/service'
import { Folder } from '../../../../app/service/model/folder'
import { Repo } from '../../../service/model/repo';
import {ToastrService} from 'ngx-toastr'
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Modeler } from "../../../bpmn-js/bpmn-js";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Viewer} from "bpmn-js/lib/Viewer.js"
declare var require: any
export var xml;
@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})

export class FileComponent implements OnInit {

  @ViewChild('ref') private el: ElementRef;
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
  modeler;
  v: string;
  ciao: string;
  url: string;
  diagramUrl;
  importError?: Error;
  collaboration: any;
  autore: any;
  controlloAnteprima: boolean;
  controllocollaboration: boolean;
  controlloRepo: boolean;
  controlloFile: boolean;
  controlloFoldandFile: boolean;
  controlloVers: boolean;
  repos: any;
  idRepo: any;
  allFolder=<any>[];
  allFileColl=<any>[];
  sonoDaFile: boolean;
  versione: any;
  diagramUrlA: string;
  allFileFoldColl =<any>[];
  ver: any;
  ArrayVersion =<any>[];
  Versionfinal =<any>[];
  VersDeprecated =<any>[];
 
  fileToUpload: File;
  fileToUpload2: File;
  Filescelto: any;
  xml: string;
  
 
  constructor(private toastr:ToastrService,public router: Router, private http: HttpClient, private formBuilder:FormBuilder, private service: Service, private route: ActivatedRoute) {
    this.idRepoSelected = route.snapshot.params.idRepo
    this.idUser = localStorage.getItem("id")
    this.idFolder = route.snapshot.params.idFolder
    this.idFile = route.snapshot.params.idFile
    this.isLogged=service.isLogged;
    
    
  }

 async selected() {

   ; // my BPMN 2.0 xml
  /* var viewer = new Viewer({ container: 'body' });
  
  viewer.importXML(this.diagramUrl, function(err) {
  
    if (err) {
      console.log('error rendering', err);
    } else {
      console.log('rendered');
    }
  }); */
    this.cambia=true  
    this.diagramUrl="http://localhost:8080/api/file/downloadFile?idFile=" + this.idFile + "&version=" + this.vers
   /*  await this.modelerOpen() */
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
        this.toastr.success('This File has moved in the destination folder', 'Move File')

      }, error => {
        this.errorMessage = <any>error
      });

    }else{
      if(id == this.idFolder){
        this.ok2=true
        this.toastr.warning('Choose a different Folder, this is the root Folder', 'Folder')

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
 this.service.deleteFile(this.idFile,this.idRepoSelected,this.idUser,this.idFolder)
 .subscribe(data=>{
   //this.ok=true
   this.toastr.success('This File has been succesfully eliminated', 'Elimination File')

  
  
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
      this.toastr.warning('You must choose a version of file for deleting it', 'Version File')

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
        
        this.toastr.success('This File version has been succesfully deleted', 'Delete File Version')
        
         
          this.getFileSpec()
        }, error => {
          console.log(error);
        });
    }else{
      document.getElementById("buttonDelete").setAttribute("data-target","#myModalDeleteFile")
    }
  }


 handleError(err: any) {
    if (err) {
      console.warn('Ups, error: ', err);
    }
  }


  ngOnInit() {
  xml=undefined
   
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
   

   /*  this.modeler = new Modeler({
      container: '#canvas',
      width: '100%',
      height: '300px',
    
    }); */


  



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
  controlloModal(){
    this.controlloRepo=true;
    this.controlloFile=false;
    this.controlloFoldandFile=false;
    this.controlloVers=false;
    this.controlloAnteprima=false;
  }
  getFileSpec() {
    
    this.cambia=false
    for (var i = 0; i < this.versionArray.length; i++) {
      this.versionArray[i] = null
    }
    this.service.getFileSpec(this.idFile)
      .subscribe(async data => {
    
if(data.fileType=="collaboration"){
  this.controllocollaboration=true
} else{
  this.controllocollaboration=false
}
        if (data != null) {
          this.autore=data.autore
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
        if (this.vers==undefined)
        {
          this.diagramUrl= this.url = "http://localhost:8080/api/file/downloadFile?idFile=" + this.idFile + "&version=" +this.finalVersion
      
        }else{
          this.diagramUrl="http://localhost:8080/api/file/downloadFile?idFile=" + this.idFile + "&version=" + this.vers
      
        }

      }, error => {
        this.errorMessage = <any>error
      });
  }
  getAllRepos() {
    this.controllocollaboration=true
    this.controlloRepo=true;
    this.controlloFile=false;
    this.controlloFoldandFile=false;
    this.controlloVers=false;
    this.controlloAnteprima=false;

    this.service.getAllRepo().subscribe(data => {
      
      this.repos = JSON.parse(data)
      this.controlloRepo=true;
    }, error => {
      this.errorMessage = <any>error
    });
  }

  AllRepoInfo(id) {
    this.controlloRepo=false;
    
    this.idRepo=id;

    this.service.getAllFolder(id)
  
    .subscribe(data => {
      if(data != []){
     this.allFolder = JSON.parse(data)
     this.controlloFoldandFile=true;

      }
      else{
      }

    }, error => {
      this.errorMessage = <any>error
    });

    this.service.getFile(id)
    .subscribe(data => {
      var file =JSON.parse(data)
    
      var j=0;
      var z=0;
    for(let i=0;i<file.length;i++){
     
if (file[i].fileType=="collaboration"){
  
  this.allFileColl[j]=file[i]
  j++
}
    }
    }
    
    , error => {
      this.errorMessage = <any>error
    });
  

  }
chooseVers(id){
  this.controlloVers=true
if(this.controlloFoldandFile==true){
  this.controlloFoldandFile=false
  this.sonoDaFile=false;
} else{
  this.controlloFile=false
  this.sonoDaFile=true
}
  this.service.getFileSpec(id)
  .subscribe(data => {
   
   this.Filescelto = (data)
  this.ArrayVersion=[]
  this.Versionfinal=[]
  this.VersDeprecated=[]
  
   for (var i = 0; i < this.Filescelto.cVersion; i++) {
    this.ArrayVersion[i] = this.Filescelto.cVersion - (this.Filescelto.cVersion - i) + 1
  }
  
  
  //mi salvo le versioni deprecate
  for (var i = 0; i < this.Filescelto.deletedVersions.length; i++) {
    this.VersDeprecated[i] = this.Filescelto.deletedVersions[i]
  }

  var j = 0;
  for (i = 0; i < this.ArrayVersion.length; i++) {
    if (this.VersDeprecated.indexOf(this.ArrayVersion[i]) == -1) {
      this.Versionfinal[j] = this.ArrayVersion[i]
      j++
    }
    
  }
  

  }, error => {
    this.errorMessage = <any>error
  });
}
anteprimaFile(vers){
  this.versione=vers
  this.controlloAnteprima=true;
 this.diagramUrlA="http://localhost:8080/api/file/downloadFile?idFile=" + this.Filescelto.id + "&version=" + vers
 
}
back1(){
  if (this.controlloVers==true && this.sonoDaFile==false){
  this.controlloAnteprima=false;
  this.controlloVers=false,
  this.controlloFoldandFile=true
  } else if (this.controlloVers==true && this.sonoDaFile==true){
    this.controlloAnteprima=false;
    this.controlloVers=false,
    this.controlloFile=true
  } else if (this.controlloFoldandFile==true){
    this.controlloFoldandFile=false;
    this.controlloRepo=true
  }else if (this.controlloFile==true){
    this.controlloFile=false
    this.controlloFoldandFile=true;
  }
}
  AllFolderInfo(id){
    this.controlloFoldandFile=false;
    this.service.getFile(this.idRepo,id)
    .subscribe(data => {
      var file =JSON.parse(data)
    
      var j=0;
      var z=0;
    for(let i=0;i<file.length;i++){
     
if (file[i].fileType=="collaboration"){
  
  this.allFileFoldColl[j]=file[i]
  j++
}

    }
   
     this.controlloFile=true

     /* console.log(this.allFile) */
    }, error => {
      this.errorMessage = <any>error
    });
  }

  newVersion() {
//this.getFileSpec()

this.service.createNewVersion(this.idFile, this.vers)
      .subscribe(data => {
       data = JSON.parse(data)

        for (var i = 1; i <= data.cVersion; i++) {
          this.versionArray[i - 1] = i
        }
        this.cambia=false
        this.vers=data.cVersion;
        this.toastr.success('A new File version has been succesfully created', ' File Version')
        this.getFileSpec()
      }, error => {
        this.errorMessage = <any>error
      });
  }

  downloadAllVersion(){
      window.open("http://localhost:8080/api/file/exportCollection?idFile="+this.idFile)
  }
mergeFile(){

  this.http.get("http://localhost:8080/api/file/downloadFile?idFile=" + this.Filescelto.id + "&version=" + this.versione , { responseType: "text" } ).subscribe(response => {
  this.fileToUpload=new File([response.toLocaleString()],this.Filescelto.originalName);
 this.xml=response

} )

if (this.vers==undefined)
{
  this.http.get("http://localhost:8080/api/file/downloadFile?idFile=" + this.idFile + "&version=" + this.finalVersion , { responseType: "text" } ).subscribe(response => {
    this.fileToUpload2=new File([response.toLocaleString()],this.file.originalName);
  } )
}else{
  this.http.get("http://localhost:8080/api/file/downloadFile?idFile=" + this.idFile + "&version=" + this.vers , { responseType: "text" } ).subscribe(response => {
    this.fileToUpload2=new File([response.toLocaleString()],this.file.originalName);
  } )

}





setTimeout(()=>{
  
this.service.merge(this.fileToUpload2, this.fileToUpload)
      .subscribe(data => {
      
   xml=data
       if(this.idFolder==undefined ){
         console.log(this.idRepoSelected)
        this.router.navigate(['repositoryID', this.idRepoSelected,'editorBPMNCollaboration']);
      } else{
        this.router.navigate(['repositoryID', this.idRepoSelected,'folderID',this.idFolder, 'editorBPMNCollaboration']);
        }
      }, error => {
        
        this.toastr.error(error.error)
      });
    } ,500);
}



  createFile() {
    this.fileAppear = true;
  }

  modifyRepo() {
    this.appear = true;
  }

/*   saveFile(originalName) {
    this.service.createFile(this.idRepoSelected,  this.idUser, this.idFolder, originalName)
      .subscribe(data => {
        this.fileAppear = false;
        this.fileExist = true;
        this.file = JSON.parse(data)
        this.versionArray[0] = 1

      }, error => {
        this.errorMessage = <any>error
      });
  } */


  back() {
    if(this.idFolder !=null){
      this.router.navigate(['repositoryID/',this.idRepoSelected,'folderID',this.idFolder]);
    }else {
      this.router.navigate(['repositoryID/',this.idRepoSelected,]);
    }
  }

  exportModel() {
          window.open("http://localhost:8080/api/file/downloadFile?idFile=" + this.idFile + "&version=" + this.vers)
      /*  this.downloadFile() */
    this.toastr.success('File downloaded with success', 'Download File')

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
        this.toastr.success('The name of this file has been succesfully modified', 'Name File')

        this.submitted=false
        this.clearModal(this.closeModal3)
        

       
      }, error => {
        this.errorMessage = <any>error
      });
  }


  shareFile(email,nameRepo) {

    this.submitted = true;
    if (this.shareFileForm.invalid) {
      return;
  }

    this.service.shareFile( this.repo.repositoryName, this.idUser,this.idFile,email,this.autore)
      .subscribe(data => {
        this.ok=true
        this.toastr.success('This file has been succesfully shared', 'Share File')

         this.clearModal(this.closeModal2)
        
       
        this.share = false
      }, error => {
        alert("ERRORE! Invio email non riuscito")
        this.errorMessage = <any>error
      })
  }

  sendToEditor(v) {
    xml=undefined
    if(this.idFolder==undefined){
      if(this.file.fileType == "collaboration"){
      this.router.navigate(['repositoryID',this.idRepoSelected,'fileID',this.idFile,'editorBPMNCollaboration',v]);
    }
      else{
      this.router.navigate(['repositoryID',this.idRepoSelected,'fileID',this.idFile,'editorBPMNChoreography',v]);
      }
    }
    else{
      if(this.file.fileType == "collaboration"){
        this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',this.idFolder,'fileID',this.idFile,'editorBPMNCollaboration',v]);
    }
    else{
        this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',this.idFolder,'fileID',this.idFile,'editorBPMNChoreography',v]);
    }
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
