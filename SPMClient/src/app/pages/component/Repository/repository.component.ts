import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild("closeModalModifyRepo") closeModal1: ElementRef
  @ViewChild("closeModalCreateFolder") closeModal2: ElementRef
  @ViewChild("closeModalCreateFile") closeModal3: ElementRef
  @ViewChild("closeModalShareRepo") closeModal4: ElementRef
  
  isLogged: boolean
  selectedfolder: any
  createFold: boolean
  idRepoSelected: string
  nameRepoSelect: string
  idUser: string
  folder = null
  repoInfo: Repo = <any>[]
  folderExist: boolean = false
  createfold = false
  errorMessage: any;
  appear: boolean = false;
  createfile = false;
  files = null;
  idFileSelected: any;
  filesExist: boolean = false;
  dataTroncata: any;
  fileToUpload;
  selezione = "name";
  search='';
  allFileFolder = [];
  share: boolean = false;
  fileincartelle = false;
  refresh: boolean = false;
  ok: boolean=false;
  message: string='';
  reset: string='';

  constructor(private service: Service, public router: Router, private route: ActivatedRoute) {
    this.idRepoSelected = route.snapshot.params.idRepo
    this.isLogged = service.isLogged;
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


  shareRepo(email) {

    this.service.shareRepository(this.idRepoSelected, email)
      .subscribe(data => {
        this.ok=true
        this.message="Repository condivisa correttamente!"

        setTimeout(() => {
          this.clearModal(this.closeModal4)
					this.ok = false
					this.message = '',
          this.reset = ''
        }, 2000)
        
      this.share = false
      }, error => {
        this.ok=true
        this.message="ERRORE! Invio email non riuscito"
        this.errorMessage = <any>error
      })
  }

  	//how to close a modal
	clearModal(modal): any {
		modal.nativeElement.click()
	}

  sendNewName(name) {
    this.service.changeNameRepo(this.idRepoSelected, name)
      .subscribe(data => {
        this.ok=true
        this.message="Repository modificata correttamente!"
        this.repoInfo = data
        
        setTimeout(() => {
          this.clearModal(this.closeModal1)
					this.ok = false
					this.message = '',
          this.reset = ''
				}, 2000);

        this.getRepo()
      }, error => {
        this.message="Errore!"
        this.errorMessage = <any>error
      });
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
    this.selezione = (<HTMLInputElement>document.getElementById("select")).value;
  }

  saveFile(fileName) {
    var name = fileName
    var idfolder = null
    
    this.service.createFile(this.idRepoSelected, this.idUser, name, idfolder)
      .subscribe(data => {
        this.ok=true
        this.message="File creato correttamente!"
        var file = JSON.parse(data)
        setTimeout(() => {
          this.clearModal(this.closeModal3)
          this.ok = false
          this.message = '',
          this.reset = ''
        }, 2000);

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
      }, error => {
        this.ok=true
        this.message="Errore!"
        this.errorMessage = <any>error
      })
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

  Search() {
    this.fileincartelle = true;
    if (this.selezione == "name") {
      if (this.search != "") {
        this.files = this.files.filter(res => {
          return res.originalName.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
        })
        this.folder = this.folder.filter(res => {
          return res.folderName.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
        })
        this.allFileFolder = this.allFileFolder.filter(res => {
          return res.originalName.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
        })

      } else if (this.search == "") {
        this.fileincartelle = false;
        this.ngOnInit()
      }
    }

    if (this.selezione == "date") {
      if (this.search != "") {
        this.files = this.files.filter(res => {
          return res.createdAt.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
        })

        this.folder = this.folder.filter(res => {
          return res.createdAt.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
        })
        this.allFileFolder = this.allFileFolder.filter(res => {
          return res.createdAt.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
        })
      } else if (this.search == "") {
        this.fileincartelle = false;

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
        this.ok=true
        this.message="Folder creata correttamente!"
        var folder = JSON.parse(data)
        this.service.getFolderSpec(folder.id)
          .subscribe(data => {
           
            var newFolder: Folder = data
            newFolder.createdAt = this.troncaData(newFolder.createdAt)
            var count = this.folder.length
            this.folder[count] = newFolder
            this.folderExist = true

            setTimeout(() => {
              this.clearModal(this.closeModal2)
              this.ok = false
              this.message = '',
              this.reset = ''
            }, 2000);

          }, error => {
            this.message="Errore"
            this.errorMessage = <any>error
          });
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
        this.allFileFolder.length = 0;
        for (var i = 0; i < data.length; i++) {

          data[i].createdAt = this.troncaData(data[i].createdAt)

          this.service.getFile(this.idRepoSelected, data[i].id)
            .subscribe(tuttifile => {
              tuttifile = JSON.parse(tuttifile)

              for (var i = 0; i < tuttifile.length; i++) {
                tuttifile[i].createdAt = this.troncaData(tuttifile[i].createdAt)
              }
              var k = 0;
              for (var j = this.allFileFolder.length; k < tuttifile.length; j++) {

                this.allFileFolder[j] = tuttifile[k]
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
        console.log(this.files)
        if (this.files.length > 0) {
          this.filesExist = true
        }
      },
        error => {
          this.errorMessage = <any>error
        });
  }


  sendTofolder(folderSelected) {
    this.router.navigate(['repositoryID', this.idRepoSelected, 'folderID', folderSelected]);

  }

  sendTofile(fileSelected) {
    this.router.navigate(['repositoryID', this.idRepoSelected, 'fileID', fileSelected]);
  }

}