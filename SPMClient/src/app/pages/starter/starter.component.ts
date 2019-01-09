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
	repoExist:boolean = false
	subtitle: string
	isLogged:boolean
	fileToUpload: File
	createrepo = false;
	risp: boolean;
	repos: Repo[] = null;
	errorMessage: any;
	localUser: User
	selectedRepo;
	files: any;
	idFileSelected: any;
	reposPublic: any = null;

	constructor(private service: Service, public router: Router) {
		this.isLogged=this.service.isLogged
		
	}

	ngOnInit() {
		this.setUser();
		this.getAllPublicRepo();

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
			//SET EXPORT 
			exportLocalUser = this.localUser; 
			this.getAllRepo();
		}
	} 


	//funzione per prendere il file
	/* handleFileInput(files: File) {
		this.fileToUpload = files;
	} */

	
	//funzione per prendere tutti i repo pubblici + quelli privati dell'utente
	getAllRepo() {
		this.service.getAllRepo().subscribe(data => {
			this.repos = JSON.parse(data)
			if(this.repos.length>0){
				this.repoExist=true
			}
		}, error => {
			this.errorMessage = <any>error
		});
	}


	getAllPublicRepo() {
		this.service.getAllRepoPublic().subscribe(data => {
			this.reposPublic = data
		}, error => {
			this.errorMessage = <any>error
		});
	} 


	sendTo(repoSelected) {
		localStorage.setItem("repoSelected", repoSelected)

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
					this.createrepo=false
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
		if(this.createrepo==true){
			this.createrepo=false
		}
		else if(this.createrepo==false){
			this.createrepo=true
		}
	}


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
		//controllo se il file caricato è un file bpmn
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