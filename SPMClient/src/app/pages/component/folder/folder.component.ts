import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Folder } from '../../../service/model/folder'
import { Service } from '../../../service/service';
import { Router, ActivatedRoute } from '@angular/router';
import { Repo } from '../../../service/model/repo';
import { exportIsLogged } from '../../starter/starter.component'
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-Folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})

export class FolderComponent implements OnInit {
  @ViewChild("closeModifyName") closeModal1: ElementRef
  @ViewChild("closeNewFile") closeModal2: ElementRef
  @ViewChild("closeModalChooseFile") closeModal6: ElementRef
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
  modifyNameFolder: FormGroup;
  submitted=false;
  collaboration: any;
  b: string;

  constructor(private toastr:ToastrService,private formBuilder:FormBuilder,private service: Service, public router: Router,route: ActivatedRoute) {
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
      this.toastr.error('Errore puoi caricare esclusivamente file .bpmn', 'Formato File')
			return false;
		}
	}

  handleFileInput(files) {
    document.getElementById("menu").setAttribute("class", "dropdown dropdown-toggle grassetto ")
   document.getElementById("menu").setAttribute("aria-expanded", "false")
   document.getElementById("menu2").setAttribute("class", "dropdown-menu") 

   if (files && files[0]) {
     var myFile = files[0];
     var reader = new FileReader();
 
 reader.onload = (event: Event) => {
 this.b= reader.result.slice(0,100).toString()
 if(this.b.indexOf("<bpmn2")>-1){
   console.log("coreogr")
   this.collaboration="choreography"
 }
 else{
   console.log("collab")
   this.collaboration="collaboration"
   }
   var a = this.controlFormatFile(this.fileToUpload)
   if (a == true) {
    
     this.uploadFileToActivity()
   }
 } 

 
 this.fileToUpload = files.item(0);
 reader.readAsText(myFile);


}


 }
  uploadFileToActivity() {
    var autore = localStorage.getItem('name')+' '+localStorage.getItem('surname'); 
    console.log("eiiiii",this.collaboration)

    this.service.postFile(this.idRepoSelected,this.idUser,this.fileToUpload,autore,this.collaboration,this.folderSelected).subscribe(data => {
    //MANCA METODO PER VEDERE SE IL FILE è COLLABORATION O NO :)


      this.exist=true
      this.toastr.success('Hai Caricato il file correttamente', 'Load File')
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
modifyName(){
  this.submitted=false;
  this.reset= ""
}

  ngOnInit() {
    this.modifyNameFolder=this.formBuilder.group({
      foldername:['',Validators.required]
    
    });
    this.getRepo()
    this.getFolderInfo()
    this.getAllFile()
  }
  
  get f() { 
   
    return this.modifyNameFolder.controls;
   }
   
  modifyRepo() {
    this.appear = true;
  }
  modifyFolder() {
    this.appearFormFolder = true;
  }

  sendNewNameFolder(name) {
    this.submitted = true;
    if (this.modifyNameFolder.invalid) {

      return;
  }
    this.service.changeNameFolder(this.folderSelected, name)
      .subscribe(data => {
        this.exist=true
        this.folderInfo = data
        this.ok=true
        this.toastr.success('Nome della cartella modificato correttamente', 'Folder Name')
       
       this.clearModal(this.closeModal1)

      this.getFolderInfo()
      }, error => {
        this.toastr.error('Errore cambio nome della cartella', 'Cartella')
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

  
  goToCollaboration() {

    this.clearModal(this.closeModal6)
    if(this.folderSelected==undefined || this.folderSelected==null){
      this.router.navigate(['repositoryID', this.idRepoSelected, 'editorBPMNCollaboration']);
    } else{
      this.router.navigate(['repositoryID', this.idRepoSelected,'folderID',this.folderSelected, 'editorBPMNCollaboration']);
      }
    }

  goToChoreography() {
    this.clearModal(this.closeModal6)
    if(this.folderSelected==undefined || this.folderSelected==null){
      this.router.navigate(['repositoryID', this.idRepoSelected, 'editorBPMNChoreography']);
    } else{
      this.router.navigate(['repositoryID', this.idRepoSelected,'folderID',this.folderSelected, 'editorBPMNChoreography']);
      }
  }

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
        else{
          if(this.files.length<=0){
            document.getElementById("menu").setAttribute("class", "dropdown dropdown-toggle grassetto show")
            document.getElementById("menu").setAttribute("aria-expanded", "true")
            document.getElementById("menu2").setAttribute("class", "dropdown-menu show")
              this.exist = false
          }
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
  sendToRepoFold() {
    this.router.navigate(['']);

  }
  sendToRepo() {
    this.router.navigate(['repositoryID', this.idRepoSelected]);

  }
  sendTofile(fileSelected) {
    this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',this.folderSelected,'fileID',fileSelected]);
    }
}