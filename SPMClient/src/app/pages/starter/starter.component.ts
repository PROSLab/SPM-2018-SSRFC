import { Component, AfterViewInit } from '@angular/core'
import { Service } from '../../service/service'
import { File } from '../../service/model/file'
import { Router } from '@angular/router'
import { Repo } from '../../../app/service/model/repo'
import { User } from '../../service/model/user';

export var exportIsLogged: boolean;
export let exportLocalUser: User;

@Component({
	templateUrl: './starter.component.html',
	styleUrls: ['./starter.component.css']
})

export class StarterComponent implements AfterViewInit {
	subtitle: string;

	isLogged = exportIsLogged
	fileToUpload: File;
	createrepo = false;
	risp: boolean;
	repos: Repo[] = null;
	errorMessage: any;
	localUser: User
	email: string
	selectedRepo;

	constructor(private service: Service, public router: Router) {

	}

	ngOnInit() {
		this.setUser();
	}

	setUser() {

		if (localStorage.getItem("email") != undefined) {
			this.localUser = {
				email: localStorage.getItem("email"),
				id: localStorage.getItem("id"),
				name: localStorage.getItem("name"),
				surname: localStorage.getItem("surname"),
				password: localStorage.getItem("password"),
			};
			localStorage.setItem("login", 'true')
			this.isLogged = true;
			//SET EXPORT 
			exportLocalUser = this.localUser; exportIsLogged = this.isLogged;
			this.getAllRepo();
		}
	}


	logout() {
		exportIsLogged = false;
		this.isLogged = exportIsLogged
		this.service.logout()
	}


	//funzione per prendere il file
	/* handleFileInput(files: File) {
		this.fileToUpload = files;
	} */

	//funzione per prendere tutti i repo pubblici + quelli privati dell'utente
	getAllRepo() {
		this.service.getAllRepo().subscribe(data => {
			this.repos = JSON.parse(data)
		}, error => {
			this.errorMessage = <any>error
		});
	}

	//RENDER TO REPOSITORY SELEZIONATA
	//TODO: Non si fa cosi questa cosa.. ma non so come correggerla :/ e mi ci vorebbe troppo tempo ora
	sendTo(repoSelected) {
		for (var i = 0; i < this.repos.length; i++) {
			if (repoSelected.id == this.repos[i].id) {
				localStorage.setItem("repoSelected.id", repoSelected.id)
			}
		}
		this.router.navigate(['/folder']);
	}
	
	// SALVO IL FILE
	save(name) {
		var state = $('input[name="statep"]:checked').val();
		if (state == "public") {
			this.risp = true; //mando true  al server, quindi la repo è pubblica
		}
		else {
			this.risp = false; //mando false al server, la repo è privata
		}
		var nameRepo = name;
		this.service.createRepo(nameRepo, this.risp)
			.subscribe(data => {
				var newRepos = JSON.parse(data)
				this.service.getRepoSpec(newRepos.repository).subscribe(data => {
					var newRepo: Repo = data
					var count = this.repos.length
					this.repos[count] = newRepo
				}, error => {
					this.errorMessage = <any>error
				});
				
				this.createrepo = false;
				alert("Repository creata con successo.")
				this.router.navigate(['/']);
			}, error => {
				this.errorMessage = <any>error
				alert("Repository non creata")
			})
		this.createrepo = false
	}

	createRepo() {
		this.createrepo = true
	}

	/* uploadFileToActivity() {
			this.service.postFile(this.fileToUpload)
			.subscribe(data => {
				alert(data)
		  // do something, if upload success
		  }, error => {
					console.log(error);
	    
		  })
	  } */

	controlFormatFile(f) {
		if (f.name.split('.').pop() == "bpmn") {
			alert("formato file corretto")
			return true;
		}
		else {
			alert("formato file non corretto")
			return false;
		}
	}

	ngAfterViewInit() { }

}


	//funzione per caricare il file e inviarlo al server
   /*  caricaFile(){
		//controllo se il file caricato è un file XML
		var a = this.controlFormatFile(this.fileToUpload[0])
		if(a){
		//devo richiamare la funzione del server per inviargli il file
		 this.service.postFile(this.fileToUpload[0])
		.subscribe(data => {
		}, error => {
		  console.log(error);
		});
	    }	
    } */