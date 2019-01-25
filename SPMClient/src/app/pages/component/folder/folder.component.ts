import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Folder } from '../../../service/model/folder'
import { Service } from '../../../service/service';
import { Router, ActivatedRoute } from '@angular/router';
import { Repo } from '../../../service/model/repo';
import { exportIsLogged } from '../../starter/starter.component'

@Component({
  selector: 'app-Folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})

export class FolderComponent implements OnInit {
  @ViewChild("closeModifyName") closeModal1: ElementRef
  @ViewChild("closeNewFile") closeModal2: ElementRef
  
  selectedfolder: any
  createFold: boolean
  idRepoSelected: string
  idUser: string
  folder: Folder[] = null
  folderInfo: Folder[] = null
  repoInfo: Repo[] = null
  folderExist: boolean = false
  createfold = false
  errorMessage: any;
  appear: boolean;
  createfile = false;
  files = null;
  idFileSelected: any;
  folderSelected;
  appearFormFolder: boolean;
  fileToUpload: File;
  exist: boolean;
  dataTroncata: string;
  caricaFile: boolean=false;
  isLogged:boolean
  ok: boolean=false;
  message: string='';
  reset: string='';

  constructor(private service: Service, public router: Router,route: ActivatedRoute) {
    this.folderSelected = route.snapshot.params.idFolder
    this.idRepoSelected = route.snapshot.params.idRepo
    this.idUser = localStorage.getItem("id")
    this.isLogged=service.isLogged;
  }

  back() {
    this.router.navigate(['repositoryID/',this.idRepoSelected]);
  }

 	//how to close a modal
   clearModal(modal): any {
		modal.nativeElement.click()
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
  var a =   this.controlFormatFile(this.fileToUpload)
  if(a==true){
    this.uploadFileToActivity()
  }
  }

  uploadFileToActivity() {
    var autore = localStorage.getItem('name')+' '+localStorage.getItem('surname'); 

    this.service.postFile(this.idRepoSelected,this.idUser,this.fileToUpload,autore,this.folderSelected).subscribe(data => {
      alert("Hai caricato il file correttamente.")
      var newFile = data
      newFile.createdAt = this.troncaData(newFile.createdAt)
      var count = this.files.length
      this.files[count] = newFile
      this.exist = true
      this.caricaFile=false
    
      // do something, if upload success
    }, error => {
      console.log(error);
    });
}


  ngOnInit() {
    this.getRepo()
    this.getFolderInfo()
    this.getAllFile()
  }

  modifyRepo() {
    this.appear = true;
  }
  modifyFolder() {
    this.appearFormFolder = true;
  }

  sendNewNameFolder(name) {
    this.service.changeNameFolder(this.folderSelected, name)
      .subscribe(data => {
        this.folderInfo = data
        this.ok=true
        this.message="Folder modificata correttamente!"
       
       setTimeout(() => {
         
					this.ok = false
					this.message = '',
          this.reset = ''
				}, 2000); 
      this.getFolderInfo()
      }, error => {
        this.message='Errore!'
        this.reset=''
        this.ok=false
        this.errorMessage = <any>error
      });
  }

  getFolderInfo() {
    this.service.getFolderSpec(this.folderSelected)
      .subscribe(data => {
        data.createdAt = this.troncaData(data.createdAt)
        this.folderInfo = data
      }, error => {
        this.errorMessage = <any>error
      });
  }

  troncaData(data: String) {
    return this.dataTroncata = data.substr(0, 10)
  }

  createFile() {
    this.createfile = true;
  }

  
    saveFile() {
      this.router.navigate(['repositoryID', this.idRepoSelected,'folderID',this.folderSelected, 'editorBPMN']);
    /* var name = fileName
    this.service.createFile(this.idRepoSelected, this.idUser, name, this.folderSelected)
      .subscribe(data => {
        var file = JSON.parse(data)
        this.service.getFileSpec(file.id)
          .subscribe(data => {
            this.ok=true
            this.message="File creato correttamente!"
            setTimeout(() => {
              this.clearModal(this.closeModal2)
              this.ok = false
              this.message = '',
              this.reset = ''
            }, 2000);

            var newFile = data
            newFile.createdAt = this.troncaData(newFile.createdAt)
            var count = this.files.length
            this.files[count] = newFile
          }, error => {
            this.errorMessage = <any>error
          });
        this.createfile = false
        this.getAllFile();
      }, error => {
        this.errorMessage = <any>error
        alert("file non creato")
      })
    this.createfile = false */
  }



 /*  saveFolder(folderName) {
    var nameFolder = folderName;
    this.service.createFolder(this.idRepoSelected, this.idUser, nameFolder)
      .subscribe(data => {
        var folder = JSON.parse(data)
        this.service.getFolderSpec(folder.id)
          .subscribe(data => {
            var newFolder: Folder = data
            newFolder.createdAt = this.troncaData(newFolder.createdAt)
            var count = this.folder.length
            this.folder[count] = newFolder
          }, error => {
            this.errorMessage = <any>error
          });
        this.createfold = false
         this.router.navigate(['/folder']);
       }, error => {
        this.errorMessage = <any>error
        alert("Cartella non creata")
      })
    this.createfold = false
  } */


/* 
  getAllfolder() {
    //devo richiamare la funzione del server per inviargli il file
    this.service.getAllFolder(this.idRepoSelected)
      .subscribe(data => {
        data = JSON.parse(data)
        for (var i = 0; i < data.length; i++) {
          data[i].createdAt = this.troncaData(data[i].createdAt)
        }
        this.folder = (data)
        if (this.folder.length > 0) {
          this.exist = true;
        }
      }, error => {
        this.errorMessage = <any>error
      });
  } */

  //tutti i file
  getAllFile() {
    this.service.getFile(this.idRepoSelected, this.folderSelected)
      .subscribe(data => {
        data = JSON.parse(data)
        for (var i = 0; i < data.length; i++) {
          data[i].createdAt = this.troncaData(data[i].createdAt)
        }
        this.files = (data)
        if (this.files.length > 0) {
          this.exist = true;
        }
      }, error => {
        this.errorMessage = <any>error
      });
  }
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
  sendToRepo() {
    this.router.navigate(['']);

  }
  sendTofile(fileSelected) {
    this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',this.folderSelected,'fileID',fileSelected]);
    }
}