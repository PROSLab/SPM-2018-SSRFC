import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../../../service/service'
import { Repo } from '../../../../app/service/model/repo'
import { File } from '../../../../app/service/model/file'
import { User } from '../../../service/model/user';

import {exportIsLogged} from '../../starter/starter.component';
import {exportLocalUser} from '../../starter/starter.component';

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
  file: Repo = <any>[]
  fileExist = false;
  fileAppear = false;
  filecreato: File = <any>[];
  errorMessage: any;

  constructor(public router: Router, private service: Service) {
    this.idRepoSelected = localStorage.getItem("repoSelected.id");
  

  }

  ngOnInit() {
    //faccio una chiamata al server per vedere i dati specifici della repos.
    this.getRepo();
    this.getAllFile();
    
  }

  //prendo i dati della repo specifica
  getRepo() {
    this.service.getRepoSpec(this.idRepoSelected).subscribe(data => {
        this.repoInfo = data
      }, error => {
        this.errorMessage = <any>error
      });
  }

  getAllFile() {
    console.log('ci arrivi qui?')
    this.service.getFile(this.idRepoSelected) //gli passo l'id del repo da cui prendere il file
    .subscribe(data => {
      console.log("data è", data)
      if (data != null) {
        this.fileExist = true;
        this.file = data
        console.log("file", this.file)
      }else {
        this.fileExist = false;
      }
      console.log(data)
      }, error => {
        console.log(error);
      });
    // window.setTimeout("getUser()", 1000);
  }

  createFile(name) {
    this.fileAppear = true;
  }

  saveFile(originalName) {
    this.service.createFile(localStorage.getItem("repoSelected.id"), localStorage.getItem("id"), originalName)
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

 

  //prendo i dati dell'user specifico
  getUser() {
    this.userInfo.id = localStorage.getItem("id")
    this.service.getUserSpec(this.userInfo.id)
      .subscribe(data => {
        this.userInfo = data
        console.log("userInfo: ", this.userInfo)
      }, error => {
        console.log(error);
      });
  }
}
