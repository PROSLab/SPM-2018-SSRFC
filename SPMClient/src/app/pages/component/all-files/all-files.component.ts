import { Component, OnInit } from '@angular/core';
import { Service } from '../../../service/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-files',
  templateUrl: './all-files.component.html',
  styleUrls: ['./all-files.component.css']
})
export class AllFilesComponent implements OnInit {
  errorMessage: any;
  files: any;
  idRepoSelected: string;
  idFolderSelected: string;
  selectedfile: any;
  createfile: boolean;
  idUser: string;

  constructor(private service: Service, public router: Router) {
    this.idRepoSelected = localStorage.getItem("repoSelected.id");
    this.idFolderSelected = localStorage.getItem("folderSelected.id");
    this.idUser = localStorage.getItem("id")
    console.log(this.idFolderSelected)
   }

  ngOnInit() {
  this.getAllFile()
  }


  back(){
    this.router.navigate(['/folder']);
  }

  getAllFile(){
      this.service.getFile(this.idRepoSelected,this.idFolderSelected)
      .subscribe(data => {
        console.log(data)
        this.files =(data)
      }, error => {
        this.errorMessage = <any>error
      });
  }

  sendTofile(fileSelected) {
    for (var i = 0; i < this.files.length; i++) {
      if (fileSelected.id == this.files[i].id) {
        localStorage.setItem("fileSelected.id", fileSelected.id)
      }
    }
    this.router.navigate(['/file']);
  } 


  createFile() {
    this.createfile = true;
  }
  

  saveFile(fileName) {
    var name = fileName 
    this.service.createFile(this.idRepoSelected, this.idUser, name,this.idFolderSelected)
      .subscribe(data => {
         var file = JSON.parse(data)
        this.service.getFileSpec(file.id)
          .subscribe(data => {
            var newFile: File = data
            var count = this.files.length
            this.files[count] = newFile
          }, error => {
            this.errorMessage = <any>error
          }); 
        this.createfile = false
        alert("File creato con successo.")
       
        this.router.navigate(['/allFiles']);
      }, error => {
        this.errorMessage = <any>error
        alert("file non creato")
      })
    this.createfile = false
  } 

}
