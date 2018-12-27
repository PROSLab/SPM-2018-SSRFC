import { Component, OnInit } from '@angular/core';
import { Folder } from '../../../service/model/folder'
import { Service } from '../../../service/service';
import { Router } from '@angular/router';
import { Repo } from '../../../service/model/repo';
import  {exportIsLogged} from '../../starter/starter.component'
import { isEmpty } from 'rxjs/operators';


@Component({
  selector: 'app-Folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})

export class FolderComponent implements OnInit {
  selectedfolder: any
  createFold: boolean
  idRepoSelected: string
  idUser: string
  folder: Folder[] = null
  folderInfo: Folder[]= null
  repoInfo: Repo = <any>[]
  folderExist: boolean = false
  createfold = false
  errorMessage: any;
  appear: boolean;
  createfile=false;
  files  =null;
  idFileSelected: any;
  folderSelected: string;
  appearFormFolder: boolean;
  fileToUpload: File;
  exist: boolean;


  constructor(private service: Service, public router: Router) {
    this.idRepoSelected = localStorage.getItem("repoSelected.id");
    this.folderSelected = localStorage.getItem("folderSelected.id")
    this.idUser = localStorage.getItem("id")  
    
  }

  back(){
    this.router.navigate(['repository']);
  }


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}

  uploadFileToActivity() {
    this.service.postFile(this.fileToUpload).subscribe(data => {
      console.log(data)
      // do something, if upload success
      }, error => {
        console.log(error);
      });
  }


  ngOnInit() {
    this.getRepoInfo()
    this.getFolderInfo()
    this.getAllFile()
  }

  modifyRepo() {
    this.appear = true;
  }
  modifyFolder() {
    this.appearFormFolder = true;
  }

  sendNewNameRepo(name) {
    this.service.changeNameRepo(this.idRepoSelected, name)
      .subscribe(data => {
        this.appear = false
        this.repoInfo = data

      })
  }
  sendNewNameFolder(name) {
    this.service.changeNameFolder(this.folderSelected, name)
      .subscribe(data => {
        this.appearFormFolder = false
        this.folderInfo = data

      })
  }

  //prendo i dati della repo specifica
  getRepoInfo() {
    this.service.getRepoSpec(this.idRepoSelected)
      .subscribe(data => {
        this.repoInfo = data
      }, error => {
        this.errorMessage = <any>error
      });
  }
  getFolderInfo() {
    this.service.getFolderSpec(this.folderSelected)
      .subscribe(data => {
        this.folderInfo = data
      }, error => {
        this.errorMessage = <any>error
      });
  }

  createFile() {
    this.createfile = true;
  }

  saveFile(fileName) {
    var name = fileName
    this.service.createFile(this.idRepoSelected, this.idUser, name,this.folderSelected)
      .subscribe(data => {
         var file = JSON.parse(data)
        this.service.getFileSpec(file.id)
          .subscribe(data => {
            var newFile: File = data
            var count = this.files.length
            this.files[count] = newFile
          }, error => {
            this.errorMessage = <any>error
          }); 
        this.createfile = false
        alert("File creato con successo.")
      }, error => {
        this.errorMessage = <any>error
        alert("file non creato")
      })
    this.createfile = false
  }



  saveFolder(folderName) {
    var nameFolder = folderName;
    this.service.createFolder(this.idRepoSelected, this.idUser, nameFolder)
      .subscribe(data => {
        var folder = JSON.parse(data)
        this.service.getFolderSpec(folder.id)
          .subscribe(data => {
            var newFolder: Folder = data
            var count = this.folder.length
            this.folder[count] = newFolder
          }, error => {
            this.errorMessage = <any>error
          });
        this.createfold = false
        alert("Cartella creata con successo.")
        this.router.navigate(['/folder']);
      }, error => {
        this.errorMessage = <any>error
        alert("Cartella non creata")
      })
    this.createfold = false
  }



  getAllfolder() {
    console.log(this.idRepoSelected)

    //devo richiamare la funzione del server per inviargli il file
    this.service.getAllFolder(this.idRepoSelected)
      .subscribe(data => {
        this.folder = JSON.parse(data)
        if(this.folder.length>0){
          this.exist=true;
        }
      }, error => {
        this.errorMessage = <any>error
      });

  
  }

  //tutti i file
   getAllFile() {
		this.service.getFile(this.idRepoSelected,this.folderSelected)
		.subscribe(data => {
      console.log(data)
      this.files =(data)
      if(this.files.length>0){
        this.exist=true;
      }
		}, error => {
		  this.errorMessage = <any>error
		});
	  } 

 sendTofile(fileSelected) {
  localStorage.setItem("fileSelected.id", fileSelected)
  } 
}