import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../../../service/service'
import { Repo } from '../../../../app/service/model/repo'
import { File } from '../../../../app/service/model/file'
import { Folder } from '../../../../app/service/model/folder'


@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})


export class FileComponent implements OnInit {
  repoInfo: Repo = <any>[]
  idRepoSelected: string;
  idUser: string;
  userInfo: any;
  folder: Folder = <any>[]
  file = <any>[]
  fileExist = false;
  fileAppear = false;
  filecreato: File = <any>[];
  idFolder: string;


  constructor(public router: Router, private service: Service) {
    this.idRepoSelected = localStorage.getItem("repoSelected.id");
    this.idUser = localStorage.getItem("id")
    this.idFolder = localStorage.getItem("folderSelected.id")
  }


  ngOnInit() {
    //faccio una chiamata al server per vedere i dati specifici della repos.
    this.getRepo();
    this.getAllFile();
    console.log("l'id repo è", this.idRepoSelected)
    console.log("l'id user è", this.idUser)
    console.log("l'id folder è", this.idFolder)
  }


  //prendo i dati della repo specifica
  getRepo() {
    this.service.getRepoSpec(this.idRepoSelected)
      .subscribe(data => {
        this.repoInfo = data
        if (this.repoInfo.publicR == "true") {
          this.repoInfo.publicR = "public"; //mando true al server, quindi la repo è pubblica
        }
        else {
          this.repoInfo.publicR = "private"; //mando false al server, la repo è privata
        }
        console.log("repoInfo: ", this.repoInfo)
      },error => {
        console.log(error);
      });
  }


  createFile() {
    this.fileAppear = true;
  }


  saveFile(originalName) {
    this.service.createFile(this.idRepoSelected,this.idFolder, this.idUser, originalName)
      .subscribe(data => {
        this.fileAppear = false;
        this.fileExist = true;
        this.file = JSON.parse(data)
        console.log(this.file)
       // location.reload();
      }, error => {
        console.log(error);
      });
  }


  getAllFile() {
    this.service.getFile(this.idFolder) //gli passo l'id della cartella da cui prendere il file
      .subscribe(data => {
        console.log("data è", data)
        if (data != null) {
          this.fileExist = true;
          this.file = data
          console.log("file", this.file)
        }
        else {
          this.fileExist = false;
        }
        console.log(data)
      }, error => {
        console.log(error);
      });
    // window.setTimeout("getUser()", 1000);
  }


  //prendo i dati dell'user specifico
  getUser() {
    this.service.getUserSpec(this.idUser)
      .subscribe(data => {
        this.userInfo = data
        console.log("userInfo: ", this.userInfo)
      }, error => {
        console.log(error);
      });
  }
}
