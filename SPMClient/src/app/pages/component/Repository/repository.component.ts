import { Component, OnInit } from '@angular/core';
import { Folder } from '../../../service/model/folder'
import { Service } from '../../../service/service';
import { Router } from '@angular/router';
import { Repo } from '../../../service/model/repo';
import { File } from '../../../service/model/file'

@Component({
  selector: 'app-Repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})

export class RepositoryComponent implements OnInit {
  selectedfolder: any
  createFold: boolean
  idRepoSelected: string
  idUser: string
  folder: Folder[] = null
  repoInfo: Repo = <any>[]
  folderExist: boolean = false
  createfold = false
  errorMessage: any;
  appear: boolean;
  createfile=false;
  files: File[]  =null;
  idFileSelected: any;


  constructor(private service: Service, public router: Router) {
    this.idRepoSelected = localStorage.getItem("repoSelected.id");
    this.idUser = localStorage.getItem("id")  
  }

  back(){
    this.router.navigate(['']);
  }


  ngOnInit() {
    this.getRepo()
    this.getAllfolder()
    this.getAllFile()
  }

  modifyRepo(name) {
    this.appear = true;
  }

  sendNewName(name) {
    this.service.changeNameRepo(this.idRepoSelected, name)
      .subscribe(data => {
        this.appear = false
        this.repoInfo = data

      })
  }
  //prendo i dati della repo specifica
  getRepo() {
    this.service.getRepoSpec(this.idRepoSelected)
      .subscribe(data => {
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

  saveFile(fileName) {
    var name = fileName
    var idfolder=null
    this.service.createFile(this.idRepoSelected, this.idUser, name,idfolder)
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
        //this.router.navigate(['/folder']);
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
        //this.router.navigate(['/folder']);
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
        this.folder = JSON.parse(data)
        //console.log('getALLfOLDER',this.folder)
      }, error => {
        this.errorMessage = <any>error
      });

  
  }

  //tutti i file
   getAllFile() {
		this.service.getFile(this.idRepoSelected,null)
		.subscribe(data => {
		  //console.log('allfiles',data)
		  this.files = (data)
		}, error => {
		  this.errorMessage = <any>error
		});
	  } 

  
  sendTofolder(folderSelected) {
    localStorage.setItem("folderSelected.id", folderSelected)
    
  } 


 sendTofile(fileSelected) {
  localStorage.setItem("fileSelected.id", fileSelected)
  } 
}