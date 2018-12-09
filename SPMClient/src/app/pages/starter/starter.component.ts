import { Component, AfterViewInit } from '@angular/core';
import { Service } from '../../service/service';
import{File} from '../../service/model/file';

export var isLogged:boolean;

@Component({
	templateUrl: './starter.component.html',
	styleUrls: ['./starter.component.css']
})
export class StarterComponent implements AfterViewInit {
	subtitle: string;
	email: string;
	isLogged=isLogged;
	fileToUpload: File;
	createrepo=false;
	risp: boolean;

	constructor(private service: Service) { }

	ngOnInit() {
		if (localStorage.getItem("email") != undefined) {
			this.email = localStorage.getItem("email");
			isLogged = true;this.isLogged=isLogged
		
		}
	}

	//funzione per prendere il file
	handleFileInput(files: File) {
		this.fileToUpload = files;
	}

	//funzione per caricare il file e inviarlo al server
    caricaFile(){
		//controllo se il file caricato è un file XML
		var a = this.controlFormatFile(this.fileToUpload[0])
		if(a){
		//devo richiamare la funzione del server per inviargli il file
		 this.service.postFile(this.fileToUpload[0])
		.subscribe(data => {
			alert(data)
		}, error => {
		  console.log(error);
		});
	    }	
    }

save(name){
var state = $('input[name="statep"]:checked').val();
if(state=="public"){
this.risp= true; //mando true  al server, quindi la repo è pubblica
}
else{
	this.risp= false; //mando false al server, la repo è privata
}

var nameRepo = name;
 this.service.createRepo(nameRepo,this.risp)
		.subscribe(data => {
			console.log(data)
			alert("Repository creata con successo.")
			this.createrepo = false;
      }, error => {
		alert("Repository non creata")
	  }) 
	  this.createrepo=false
}

	createRepo() {
	this.createrepo = true;

		
  }


	logout() {
		isLogged = false;this.isLogged=isLogged
		this.service.logout()
	}
	

uploadFileToActivity() {
	
		this.service.postFile(this.fileToUpload)
		.subscribe(data => {
			alert(data)
      // do something, if upload success
      }, error => {
				console.log(error);
    
      })
  }

  controlFormatFile(f){
	if(f.name.split('.').pop() == "bpmn"){
		alert("formato file corretto")
		return true;
	}

	else{
		alert("formato file non corretto")
		return false;
	}

  }

	ngAfterViewInit() { }
}