import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
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
	@ViewChild("closeModal") closeModal: ElementRef
	repoExist: boolean = false
	subtitle: string
	isLogged: boolean
	fileToUpload: File
	risp: boolean;
	repos: Repo[] = null
	errorMessage: any
	localUser: User
	selectedRepo
	files: any
	idFileSelected: any
	reposPublic: any = null
	message: string = ''
	ok: boolean = false
	reset: string = ''

	constructor(private service: Service, public router: Router) {
		this.isLogged = this.service.isLogged

	}

	ngOnInit() {
		this.setUser();
		this.getAllPublicRepo();
	}

	//how to close a modal
	clearModal(): any {
		this.closeModal.nativeElement.click()
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
			exportLocalUser = this.localUser
			this.getAllRepo()
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
			if (this.repos.length > 0) {
				this.repoExist = true
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
		this.ok = true
		var state = $('input[name="statep"]:checked').val();
		if (state == "public") {
			this.risp = true //mando true  al server, quindi la repo è pubblica
		}
		else {
			this.risp = false //mando false al server, la repo è privata
		}
		var nameRepo = name;
		this.service.createRepo(nameRepo, this.risp)

			.subscribe(data => {
				this.repoExist=true
				this.message = "Repository creata correttamente."

				var newRepos = JSON.parse(data)
				this.clearModal()
				setTimeout(() => {
					
					this.ok = false
					this.message = '',
					this.reset = ''
				}, 2000);

				this.service.getRepoSpec(newRepos.repository).subscribe(data => {
					var newRepo: Repo = data
					var count = this.repos.length
					this.repos[count] = newRepo
				}, error => {
					this.errorMessage = <any>error
				});

				this.router.navigate(['/']);
			}, error => {
				this.message = "Errore nella creazione della repository."
				this.errorMessage = <any>error
				alert("Repository non creata")
			})
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