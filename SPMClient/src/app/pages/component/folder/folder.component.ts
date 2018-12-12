import { Component, OnInit } from '@angular/core';
import { Folder } from '../../../service/model/folder'
import { Service } from '../../../service/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})

export class FolderComponent implements OnInit {
  
  selectedfolder: any;
  length: any;
	createFold: boolean;
	idRepoSelected: string;
	idUser: string;
	folder: any;
	fold:Folder[] =null;

  constructor(private service: Service,public router: Router) { 
	this.idRepoSelected = localStorage.getItem("repoSelected.id");
    this.idUser = localStorage.getItem("id")
  }

  ngOnInit() {
	this.getAllfolder();
  }

  createFolder() {
    this.createFold = true;
  }

  saveFolder(folderName) {
    this.service.createFolder(this.idRepoSelected, this.idUser, folderName)
      .subscribe(data => {
       /*  this.fileAppear = false;
        this.fileExist = true; */
        this.folder = JSON.parse(data)
        console.log(this.folder)
       // location.reload();
      }, error => {
        console.log(error);
      });
  }


  getAllfolder(){
		//devo richiamare la funzione del server per inviargli il file
		 this.service.getAllFolder(localStorage.getItem("repoSelected.id"))
		.subscribe(data => {

      this.fold = JSON.parse(data)
      console.log(this.fold)
      this.length=data.length //lunghezza delle carelle, quante ce ne sono
		}, error => {
		    console.log(error);
		});	
  }
  

	sendTo(folderSelected){
		this.selectedfolder=folderSelected  
	 	for(var i=0;i<this.fold.length;i++){
			if(folderSelected.id == this.fold[i].id){
				localStorage.setItem("folderSelected.id",folderSelected.id)
			}
		}
		this.router.navigate(['/file']);
	}


}
