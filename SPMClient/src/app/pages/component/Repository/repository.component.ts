import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Folder } from '../../../service/model/folder'
import { Service } from '../../../service/service';
import { Router, ActivatedRoute } from '@angular/router';
import { Repo } from '../../../service/model/repo';
import { File } from '../../../service/model/file'
import { exportIsLogged } from '../../starter/starter.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  @ViewChild("closeModalImport") closeModal5: ElementRef
  isLogged: boolean
  selectedfolder: any
  createFold: boolean
  idRepoSelected: string
  nameRepoSelect: string
  idUser: string
  folder = null
  repoInfo: Repo = <any>[]
  folderExist: boolean
  createfold = false
  errorMessage: any;
  appear: boolean = false;
  createfile = false;
  files = null;
  idFileSelected: any;
  filesExist: boolean;
  dataTroncata: any;
  fileToUpload;
  selezione = "name";
  search = '';
  allFileFolder = [];
  share: boolean = false;
  fileincartelle = false;
  refresh: boolean = false;
  ok: boolean = false;
  message: string = '';
  reset: string = '';
  ok2: boolean;
  open1 = false
  info = false
  originalfiles: any;
  originalAllFileFolder: any[];
  originalfolder: any;
  lastSelected: string;
  openSearch = false
  shareRepoForm:FormGroup
  createFolderForm:FormGroup
  modifyNameRepo:FormGroup
  submitted= false;

  constructor(private toastr:ToastrService,private formBuilder:FormBuilder,private service: Service, public router: Router, private route: ActivatedRoute, private modal: NgbModal) {
    this.idRepoSelected = route.snapshot.params.idRepo
    this.isLogged = service.isLogged;
    this.idUser = localStorage.getItem("id")
  }

  back() {
    this.router.navigate(['']);
  }


  ngOnInit() {
    this.modifyNameRepo=this.formBuilder.group({

      reponame:['',Validators.required]
    
    });
    this.createFolderForm=this.formBuilder.group({

      foldername:['',Validators.required]
    
    });
    this.shareRepoForm=this.formBuilder.group({

      shareRepo:['',[Validators.required,Validators.email]]
    
    });
    this.getRepo()
    this.getAllfolder()
    this.getAllFile()
  }
get f(){
  return this.modifyNameRepo.controls;
}
get g(){
  return this.createFolderForm.controls;
}
get h(){
  return this.shareRepoForm.controls;
}
  shareRepo(email) {
    this.submitted = true;
    if (this.shareRepoForm.invalid) {
    
      return;

  }
    this.clearModal(this.closeModal4)
    this.service.shareRepository(this.idRepoSelected, email)
      .subscribe(data => {
        
      	this.toastr.success('Repository condivisa con successo', 'Share Repository')

        this.share = false
      },
        error => {
          this.toastr.error('Errore nell invio del Repository', 'Share Repository')
          this.errorMessage = <any>error
        })
  }

  //how to close a modal
  clearModal(modal): any {
    modal.nativeElement.click()
  }
reset1(){
this.reset=""
this.submitted=false;
}
  sendNewName(name) {
    this.submitted = true;
    if (this.modifyNameRepo.invalid) {
      console.log(this.modifyNameRepo.invalid, this.submitted, this.f.reponame.errors)
      return;
  }
    this.service.changeNameRepo(this.idRepoSelected, name)
      .subscribe(data => {
        this.clearModal(this.closeModal1)
        this.repoInfo = data
        this.ok = true
        this.toastr.success('Nome del Repository modificata correttamente', 'Repository Name')

        this.getRepo()

      }, error => {
        this.toastr.error('Errore nella modifica del nome della cartella', 'Repository name')
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


  selected() {

    this.selezione = (<HTMLInputElement>document.getElementById("select")).value;
    if (this.selezione != this.lastSelected) {
      this.lastSelected = this.selezione
      this.search = ''
      this.fileincartelle = false;
      this.ngOnInit()
    }

  }

  saveFile() {
    this.router.navigate(['repositoryID', this.idRepoSelected, 'editorBPMN']);
  }


  controlFormatFile(f) {
    if (f.name.split('.').pop() == "bpmn") {
      return true;
    }
    else if (f.name.split('.').pop() != "bpmn") {

      this.toastr.error('Formato file non corretto', 'Formato File')


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
      console.log(this.selezione)
      if (this.search != "") {

        this.files = this.originalfiles.filter(res => {
          return res.originalName.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
        })
        this.folder = this.originalfolder.filter(res => {
          return res.folderName.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
        })


        this.allFileFolder = this.originalAllFileFolder.filter(res => {
          return res.originalName.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
        })

      } else if (this.search == "") {
        this.fileincartelle = false;
        this.ngOnInit()
      }
    }

    if (this.selezione == "date") {
      if (this.search != "") {
        this.files = this.originalfiles.filter(res => {
          return res.createdAt.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
        })

        this.folder = this.originalfolder.filter(res => {
          return res.createdAt.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
        })
        this.allFileFolder = this.originalAllFileFolder.filter(res => {
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

      var newFile = data
      newFile.createdAt = this.troncaData(newFile.createdAt)
      var count = this.files.length
      this.files[count] = newFile
      
      this.toastr.success('File Importato con successo', 'Import File')
    }, error => {
      console.log(error);
    });
  }


  saveFolder(folderName) {

    this.submitted = true;

    if (this.createFolderForm.invalid) {
      return;
  }
    var nameFolder = folderName;
    this.service.createFolder(this.idRepoSelected, this.idUser, nameFolder)
      .subscribe(data => {
        this.clearModal(this.closeModal2)
        this.ok = true
      	this.toastr.success('Cartella creata con successo', 'Folder')
        var folder = JSON.parse(data)
        this.service.getFolderSpec(folder.id)
          .subscribe(data => {
            var newFolder: Folder = data
            newFolder.createdAt = this.troncaData(newFolder.createdAt)
            var count = this.folder.length
            this.folder[count] = newFolder
            this.folderExist = true

          }, error => {
           
            this.errorMessage = <any>error
          });
      }, error => {
        this.errorMessage = <any>error
        this.toastr.error('Cartella non creata', 'Cartella')
      })
    this.createfold = false
  }


  getAllfolder() {
    //prende tutte le cartelle create
    this.service.getAllFolder(this.idRepoSelected)
      .subscribe(data => {
        data = JSON.parse(data)

        if (data.length == 0) { this.filesExist = false }
        else { this.filesExist = true }

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
              this.originalAllFileFolder = this.allFileFolder
            }, error => {
              this.errorMessage = <any>error
            });
        }
        this.folder = (data)
        this.originalfolder = this.folder
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
        if (data.length == 0) { this.folderExist = false }
        else { this.filesExist = true }
        for (var i = 0; i < data.length; i++) {
          data[i].createdAt = this.troncaData(data[i].createdAt)
        }
        this.files = (data)
        this.originalfiles = this.files

        if (this.files.length > 0) {
          this.filesExist = true
        }
      },
        error => {
          this.errorMessage = <any>error
        });
  }


  refreshTable() {
    this.search = ""
    this.fileincartelle=false;
    this.getAllfolder();
    this.getAllFile();
  }

  sendToRepo() {
    this.router.navigate(['']);

  }

  sendTofolder(folderSelected) {
    this.router.navigate(['repositoryID', this.idRepoSelected, 'folderID', folderSelected]);
  }

  sendTofile(fileSelected) {
    this.router.navigate(['repositoryID', this.idRepoSelected, 'fileID', fileSelected]);
  }

}