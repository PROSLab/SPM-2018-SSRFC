import { Component, OnInit } from '@angular/core';
import { Folder } from '../../../service/model/folder'
import { Service } from '../../../service/service';
import { Router } from '@angular/router';
import { Repo } from '../../../service/model/repo';
import { File } from '../../../service/model/file'

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
  files: File[]  =null;
  idFileSelected: any;
  folderSelected: string;
  appearFormFolder: boolean;


  constructor(private service: Service, public router: Router) {
    this.idRepoSelected = localStorage.getItem("repoSelected.id");
    this.folderSelected = localStorage.getItem("folderSelected.id")
    this.idUser = localStorage.getItem("id")  
    
  }

  back(){
    this.router.navigate(['repository']);
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

  //tutti i file
   getAllFile() {
		this.service.getFile(this.idRepoSelected,this.folderSelected)
		.subscribe(data => {
		  this.files = (data)
		}, error => {
		  this.errorMessage = <any>error
		});
	  } 

 sendTofile(fileSelected) {
  localStorage.setItem("fileSelected.id", fileSelected)
  } 
}