import { Component, OnInit } from '@angular/core';
import { Folder } from '../../../service/model/folder'
import { Service } from '../../../service/service';
import { Router, ActivatedRoute } from '@angular/router';
import { Repo } from '../../../service/model/repo';
import { File } from '../../../service/model/file'
import { exportIsLogged } from '../../starter/starter.component'

@Component({
  selector: 'app-Repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})

export class RepositoryComponent implements OnInit {
  isLogged:boolean
  selectedfolder: any
  createFold: boolean
  idRepoSelected: string
  nameRepoSelect:string
  idUser: string
  folder: Folder[] = null
  repoInfo: Repo = <any>[]
  folderExist: boolean = false
  createfold = false
  errorMessage: any;
  appear: boolean = false;
  createfile = false;
  files: File[] = null;
  idFileSelected: any;
  filesExist: boolean = false;
  dataTroncata: any;
  fileToUpload;
  selezione= "name";
  search:string;
  allFileFolder= [];
  share: boolean = false;
fileincartelle=false;

  constructor(private service: Service, public router: Router,private route: ActivatedRoute) {
    this.idRepoSelected = route.snapshot.params.idRepo
    this.isLogged=service.isLogged;
    this.idUser = localStorage.getItem("id")  

   
  }

  back() {
    this.router.navigate(['']);
  }


  ngOnInit() {
    
    this.getRepo()
    this.getAllfolder()
    this.getAllFile()
  }

  modifyRepo() {
    if (this.appear == true) {
      this.appear = false;
    }
    else if (this.appear == false) {
      this.appear = true;
    }
  }

  shareRepo1() {
    this.share = true
  }

  shareRepo(email) {
    this.service.shareRepository(this.idRepoSelected, email)
      .subscribe(data => {
        alert("Email inviata!")
        this.share = false
      }, error => {
        alert("ERRORE! Invio email non riuscito")
        this.errorMessage = <any>error
      })
  }

  sendNewName(name) {
    this.service.changeNameRepo(this.idRepoSelected, name)
      .subscribe(data => {
        this.appear = false
        this.repoInfo = data

      })
  }

  troncaData(data: String) {
    return this.dataTroncata = data.substr(0, 10)
  }

  //prendo i dati della repo specifica
  getRepo() {
    this.service.getRepoSpec(this.idRepoSelected)
      .subscribe(data => {
        if (data.publicR == true) {
          data.publicR = "Public"
        }
        else {
          data.publicR = "Private"
        }

        data.createdAt = this.troncaData(data.createdAt)
        this.repoInfo = data
      }, error => {
         this.errorMessage = <any>error
      });
  }

  createFolder() {
    this.createfold = true;
  }

  createFile() {
    this.createfile = true;
  }

  selected() {

   this.selezione= (<HTMLInputElement>document.getElementById("select")).value;
  }

  saveFile(fileName) {
    var name = fileName
    var idfolder = null
    this.service.createFile(this.idRepoSelected, this.idUser, name, idfolder)
      .subscribe(data => {
        var file = JSON.parse(data)
        this.service.getFileSpec(file.id)
          .subscribe(data => {
            var newFile: File = data
            newFile.createdAt = this.troncaData(newFile.createdAt)
            var count = this.files.length
            this.files[count] = newFile
            this.filesExist = true
          }, error => {
            this.errorMessage = <any>error
          });
        this.createfile = false
        alert("File creato con successo.")
        //this.router.navigate(['/folder']);
      }, error => {
        this.errorMessage = <any>error
        alert("file non creato")
      })
    this.createfile = false
  }

  controlFormatFile(f) {
    if (f.name.split('.').pop() == "bpmn") {
      return true;
    }
    else {
      alert("formato file non corretto")
      return false;
    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    var a = this.controlFormatFile(this.fileToUpload)
    if (a == true) {
      this.uploadFileToActivity()
    }
  }

Search(){
  this.fileincartelle=true;
  if(this.selezione=="name"){
  if (this.search != ""){

    this.files=this.files.filter(res=>{
    return res.originalName.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
    })

    this.folder =this.folder.filter(res=>{
      return res.folderName.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
})
this.allFileFolder =this.allFileFolder.filter(res=>{
  return res.originalName.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
})
  }else if (this.search==""){
    this.fileincartelle=false;
    this.ngOnInit()
  }
  }
  if (this.selezione=="date"){
    if (this.search != ""){
      this.files=this.files.filter(res=>{
      return res.createdAt.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
      }) 

      this.folder =this.folder.filter(res=>{
        return res.createdAt.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
  })
  this.allFileFolder =this.allFileFolder.filter(res=>{
    return res.createdAt.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
})
    }else if (this.search==""){
      this.fileincartelle=false;

      this.ngOnInit()
    }
  }
}



  uploadFileToActivity() {
    this.service.postFile(this.idRepoSelected, this.idUser, this.fileToUpload).subscribe(data => {
      alert("Hai caricato il file correttamente.")
      var newFile = data
      newFile.createdAt = this.troncaData(newFile.createdAt)
      var count = this.files.length
      this.files[count] = newFile
    }, error => {
      console.log(error);
    });
  }


  saveFolder(folderName) {
    var nameFolder = folderName;
    this.service.createFolder(this.idRepoSelected, this.idUser, nameFolder)
      .subscribe(data => {
        var folder = JSON.parse(data)
        this.service.getFolderSpec(folder.id)
          .subscribe(data => {
            var newFolder: Folder = data
            newFolder.createdAt = this.troncaData(newFolder.createdAt)
            var count = this.folder.length
            this.folder[count] = newFolder
            this.folderExist = true
          }, error => {
            this.errorMessage = <any>error
          });
        this.createfold = false
        alert("Cartella creata con successo.")
      }, error => {
        this.errorMessage = <any>error
        alert("Cartella non creata")
      })
    this.createfold = false
  }


  getAllfolder() {
    //prende tutte le cartelle create
    this.service.getAllFolder(this.idRepoSelected)
      .subscribe(data => {
        data = JSON.parse(data)
this.allFileFolder.length=0;
        for (var i = 0; i < data.length; i++) {
          
          data[i].createdAt = this.troncaData(data[i].createdAt)

          this.service.getFile(this.idRepoSelected,data[i].id)
          .subscribe(tuttifile => {
            tuttifile = JSON.parse(tuttifile) 
          
            for (var i = 0; i < tuttifile.length; i++) {
              tuttifile[i].createdAt = this.troncaData(tuttifile[i].createdAt)
            }
            var k=0;
            for ( var j= this.allFileFolder.length; k<tuttifile.length;j++)
            {
              
  this.allFileFolder[j]=tuttifile[k]
  k++
            }
            
           
          }, error => {
            this.errorMessage = <any>error
          });


        }       
        this.folder = (data)
        if (this.folder.length > 0) {
          this.folderExist = true
        }
      }, error => {
        this.errorMessage = <any>error
      });
  }

  //tutti i file
  getAllFile() {
    this.service.getFile(this.idRepoSelected, null)
      .subscribe(data => {
        data = JSON.parse(data)

        for (var i = 0; i < data.length; i++) {
          data[i].createdAt = this.troncaData(data[i].createdAt)
        }
        this.files = (data)
        if (this.files.length > 0) {
          this.filesExist = true
        }
      },
        error => {
          this.errorMessage = <any>error
        });
  }


  sendTofolder(folderSelected) {
    this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',folderSelected]);
    
  } 

 sendTofile(fileSelected) {
  this.router.navigate(['repositoryID',this.idRepoSelected,'fileID',fileSelected]);
  }
  
}