import { Component, AfterViewInit } from '@angular/core';
import { Service } from '../../service/service';
import{File} from '../../service/model/file';

export var isLogged:boolean;

@Component({
	templateUrl: './starter.component.html'
})
export class StarterComponent implements AfterViewInit {
	subtitle: string;
	email: string;
	isLogged=isLogged;
	fileToUpload: File;

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