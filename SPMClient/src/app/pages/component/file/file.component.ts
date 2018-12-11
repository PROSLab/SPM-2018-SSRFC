import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../../../service/service'
import { Repo } from '../../../../app/service/model/repo'

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})

export class FileComponent implements OnInit {
  repoInfo:Repo = <any>[]
  id: string;
  userInfo: any;
  file:Repo = <any>[]
  fileExist=false;
  fileAppear=false;

  constructor( public router: Router,private service: Service) { }

  ngOnInit() {
     this.id=localStorage.getItem("repoSelected.id")
     //faccio una chiamata al server per vedere i dati specifici della repos.
     this.getRepo()
    this.getAllFile()
  }

  //prendo i dati della repo specifica
  getRepo(){
		 this.service.getRepoSpec(this.id)
		.subscribe(data => {
       this.repoInfo=data
       localStorage.setItem("idRepo",this.repoInfo.id.toString())

      if(this.repoInfo.publicR=="public"){
           this.repoInfo.publicR= "public"; //mando true  al server, quindi la repo è pubblica
          }
      else{
            this.repoInfo.publicR= "private"; //mando false al server, la repo è privata
          }
      console.log("repoInfo: ", this.repoInfo)
		}, error => {
		  console.log(error);
    });
    /* this.getUser(); */
  }
  

  createFile(name){
    this.fileAppear=true;
  }


  saveFile(originalName) {

    console.log(localStorage.getItem("idRepo"))
    console.log(localStorage.getItem("id"))
    
    this.userInfo.id=localStorage.getItem("id")
    this.repoInfo.id=localStorage.getItem("idRepo")
    this.service.createFile(this.repoInfo.id,this.userInfo.id,originalName)
		.subscribe(data => {
      console.log(data)
		}, error => {
		  console.log(error);
    });

  }


  getAllFile(){
    this.service.getFile(this.id) //gli passo l'id del repo da cui prendere il file
   .subscribe(data => {
     if(data!=null){
      this.fileExist=true;
       this.file=data
      console.log("file",data)
      }
      else{
        this.fileExist=false;
      }
    }, error => {
      console.log(error);
    });
    
  // window.setTimeout("getUser()", 1000);
 }
 
//prendo i dati dell'user specifico
     getUser(){
       this.userInfo.id=localStorage.getItem("id")
         this.service.getUserSpec(this.userInfo.id)
      .subscribe(data => {
          this.userInfo = data
          console.log("userInfo: ", this.userInfo)
        }, error => {
          console.log(error);
        });
    }  
}
