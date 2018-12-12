import { Component, OnInit } from '@angular/core';
import { Folder } from '../../../service/model/folder'
import { Service } from '../../../service/service';
import { Router } from '@angular/router';
import { Repo } from '../../../service/model/repo';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})

export class FolderComponent implements OnInit {
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

  constructor(private service: Service, public router: Router) {
    this.idRepoSelected = localStorage.getItem("repoSelected.id");
    this.idUser = localStorage.getItem("id")
  }

  ngOnInit() {
    this.getRepo();
    this.getAllfolder();
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
    //devo richiamare la funzione del server per inviargli il file
    this.service.getAllFolder(this.idRepoSelected)
      .subscribe(data => {
        this.folder = JSON.parse(data)
      }, error => {
        this.errorMessage = <any>error
      });
  }


  sendTo(folderSelected) {
    this.selectedfolder = folderSelected
    for (var i = 0; i < this.folder.length; i++) {
      if (folderSelected.id == this.folder[i].id) {
        localStorage.setItem("folderSelected.id", folderSelected.id)
      }
    }
    this.router.navigate(['/file']);
  }


}