import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../../../service/service'
import { File } from '../../../../app/service/model/file'
import { Folder } from '../../../../app/service/model/folder'


@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})


export class FileComponent implements OnInit {
  appearRenameFolder: boolean = false;
  appearRenameFile: boolean = false;
  fileExist = true;
  fileAppear = false;

  idRepoSelected: string;
  idUser: string;
  userInfo: any;
  folder: Folder = <any>[]
  folderInfo: Folder
  file = <any>[]
  filecreato: File = <any>[];
  errorMessage: any;
  idFolder: string;
  versionArray = [];
  appear: boolean;
  idFile: string;
  folders: any;
  repo: any;


  constructor(public router: Router, private service: Service) {
    this.idRepoSelected = localStorage.getItem("repoSelected.id");
    this.idUser = localStorage.getItem("id")
    this.idFolder = localStorage.getItem("folderSelected.id")
    this.idFile = localStorage.getItem("fileSelected.id")
  }

  ngOnInit() {
    //faccio una chiamata al server per vedere i dati specifici della repos.
    this.getFolder();
    this.getAllFolder();
    this.getAllFile();
    this.getRepo();
  }

  createFile() {
    this.fileAppear = true;
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

  newVersion() {
    this.service.createNewVersion(this.idFile, this.file.cVersion)
      .subscribe(data => {
        /* for (var i = 1; i <= data.cVersion; i++) {
          this.versionArray[i - 1] = i
        } */
        this.getAllFile()
        alert("Hai creato una nuova versione del file")
        this.router.navigate(['/file']);
      }, error => {
        this.errorMessage = <any>error
      });
  }


  back(){
    this.router.navigate(['/allFiles']);
  }


//prendo tutta la lista di tutte le cartelle  della repo
  getAllFolder(){
    this.service.getAllFolder(this.idRepoSelected)
    .subscribe(data => {
      if (data != null) {
        this.folders =JSON.parse(data)
  }
}, error => {
  this.errorMessage = <any>error
});
}

getRepo(){
  this.service.getRepoSpec(this.idRepoSelected)
  .subscribe(data => {
    if (data != null) {
      this.repo =(data)
}
}, error => {
this.errorMessage = <any>error
});
}

  //premdo i dati specifici di quel file che ho selezionato in precedenza
  getAllFile() {
    this.service.getFileSpec(this.idFile)
      .subscribe(data => {
        if (data != null) {
          this.fileExist = true;
          this.file =(data)
          for (var i = 0; i<this.file.cVersion ; i++) {
            this.versionArray[i] = this.file.cVersion - i
          }
        }
     
        else {
          this.fileExist = false;
        }
      }, error => {
        this.errorMessage = <any>error
      });
  }

  getFolder() {
    this.service.getFolderSpec(this.idFolder)
      .subscribe(data => {
        this.folderInfo = data
      }, error => {
        this.errorMessage = <any>error
      });
  }

  modifyFolder() {
    this.appearRenameFolder = true;
  }
  sendNewFolderName(name) {
    this.service.changeNameFolder(this.idFolder, name)
      .subscribe(data => {
        this.appearRenameFolder = false
        this.folderInfo = data
      })
  }
  modifyFile() {
    this.appearRenameFile = true;
  }

  sendNewFileName(name) {
    this.service.changeNameFile(this.idFile, name)
    .subscribe(data => {
      this.appearRenameFile = false
      this.file = data
      })
  }


}
