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
	fileToUpload: File = null;

	constructor(private service: Service) { }

	ngOnInit() {
		if (localStorage.getItem("email") != undefined) {
			this.email = localStorage.getItem("email");
			isLogged = true;this.isLogged=isLogged
		
		}
	}

	handleFileInput(files: File) {

		this.fileToUpload = files;
	}

caricaFile(f){
	//controllo se il file caricato è un file XML
	if(f.split('.').pop() == "bpmn"){
		alert("formato file corretto")
		//devo richiamare la funzione del server per inviargli il file!

	}	else{
		alert("formato file non corretto")
	}
	
}
	logout() {
		isLogged = false;this.isLogged=isLogged
		this.service.logout()
	}
	
uploadFileToActivity() {
    this.service.postFile(this.fileToUpload).subscribe(data => {
      // do something, if upload success
      }, error => {
        console.log(error);
      });
  }

	ngAfterViewInit() { }
}