import { Component, OnInit, Input, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../../../service/service'
import { Folder } from '../../../../app/service/model/folder'
import { Repo } from '../../../service/model/repo';

import { exportIsLogged } from '../../starter/starter.component'

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})


export class FileComponent implements OnInit {
  isLogged = exportIsLogged
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
  versionArray = [];
  appear: boolean;
  idFile: string;
  folders: any;
  repoInfo: Repo = <any>[]
  vers: any;
  deprecatedVers = [];
  lastVersion: any;
  finalVersion = []
  dataTroncata: string;
  versionExist: boolean = false;
  repo: any;
  cambia=false
  share: boolean=false;
  repoName: any;


  constructor(public router: Router, private service: Service, private route: ActivatedRoute) {
    this.idRepoSelected = localStorage.getItem("repoSelected.id")
    this.idUser = localStorage.getItem("id")
    this.idFolder = localStorage.getItem("folderSelected.id")
    this.idFile = localStorage.getItem("fileSelected.id")
  }

  selected() {
    console.log(this.vers)
    this.cambia=true
  }

  

  deleteVersion(v) {
    this.vers = v
    if (this.vers == null) {
      alert("seleziona una versione per eliminarla!")
    }
    else {
      this.cambia=false
      alert("vuoi eliminare la versione n." + this.vers + "?")
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
    this.cambia=false
    this.getFileSpec()
    this.getFolder()
    this.getRepo()
    this.getAllFolders()
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
        if (data != null) {
          data.createdAt = this.troncaData(data.createdAt)
          this.fileExist = true;
          this.file = (data)
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
          console.log(this.finalVersion)
          if (this.finalVersion.length > 0) {
            console.log("c'è un versione")
            this.versionExist = true;
          }
          else {
            console.log(" non c'è un versione")
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
        this.getFileSpec()
        alert("Hai creato una nuova versione del file")
      }, error => {
        this.errorMessage = <any>error
      });
  }

  downloadAllVersion(){
    console.log("STO SCARICANDO TUTTE LE VERSIONI DEL FILE")
  }


  downloadFile(vers) {
    window.open("http://localhost:8080/api/file/downloadFile?idFile="+this.idFile+"&version="+vers)
    this.cambia=false
  }

  createFile() {
    this.fileAppear = true;
  }

  modifyRepo() {
    this.appear = true;
  }


  sendNewNameRepo(name) {
    this.service.changeNameRepo(this.idRepoSelected, name)
      .subscribe(data => {
        this.appear = false
        this.repoInfo = data

      })
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
    this.router.navigate(['']);
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
        console.log(data)
      }, error => {
        this.errorMessage = <any>error
      });
  }


  getRepo() {
    this.service.getRepoSpec(this.idRepoSelected)
      .subscribe(data => {
        // data.createdAt = this.troncaData(data.createdAt)
        this.repoName=data.repositoryName
        this.repo = data
      }, error => {
        this.errorMessage = <any>error
      });
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

  shareFile1() {
    this.share = true
  }

  shareFile(email) {
    console.log(email,)
    this.service.shareFile(this.repoName, this.idUser,this.idFile,email)
      .subscribe(data => {
        alert("Email inviata!")
        this.share = false
      }, error => {
        alert("ERRORE! Invio email non riuscito")
        this.errorMessage = <any>error
      })
  }

}
