import { Component, OnInit, Input, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../../../service/service'
import { File } from '../../../../app/service/model/file'
import { Folder } from '../../../../app/service/model/folder'
import { Repo } from '../../../service/model/repo';


@Component({
  selector: 'app-filerepo',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})


export class FileRepositoryComponent implements OnInit {

  appearRenameFile: boolean = false;
  fileExist = true;
  fileAppear = false;
  appearFormFolder=false;
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

  constructor(public router: Router, private service: Service,private route:ActivatedRoute) {
    this.idRepoSelected = localStorage.getItem("repoSelected.id");
    this.idUser = localStorage.getItem("id")
    this.idFolder = localStorage.getItem("folderSelected.id")
    this.idFile = localStorage.getItem("fileSelected.id")
  }

  selected(){
    //in this.vers abbiamo la versione del file cliccata!
    console.log(this.vers)
  }

  deleteVersion(){
    console.log("vuoi eliminare la versione n.", this.vers)
    this.service.deleteVersion(this.idFile,this.vers)
    .subscribe(data => {
      console.log(data)
      // do something, if upload success
      }, error => {
        console.log(error);
      });
  }


  
  ngOnInit() {
    this.getFolder();
    this.getRepoInfo();
    this.getFileSpec(); 
  }

  getRepoInfo() {
    this.service.getRepoSpec(this.idRepoSelected)
      .subscribe(data => {
        this.repoInfo = data
      }, error => {
        this.errorMessage = <any>error
      });
  }

  getFileSpec() {
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

  newVersion() {
    this.service.createNewVersion(this.idFile, this.file.cVersion)
      .subscribe(data => {
         for (var i = 1; i <= data.cVersion; i++) {
          this.versionArray[i - 1] = i
        } 
        this.getFileSpec()
        alert("Hai creato una nuova versione del file")
        /* this.router.navigate(['/file']); */
      }, error => {
        this.errorMessage = <any>error
      });
  }

  createFile() {
    this.fileAppear = true;
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
    this.service.changeNameFolder(this.idFolder, name)
      .subscribe(data => {
        this.appearFormFolder = false
        this.folderInfo = data

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

 


  back(){
    this.router.navigate(['']);
  }

  //premdo i dati specifici di quel file che ho selezionato in precedenza
  

  getFolder() {
    this.service.getFolderSpec(this.idFolder)
      .subscribe(data => {
        this.folderInfo = data
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


}
