import { Component, AfterViewInit } from '@angular/core'
import { Service } from '../../service/service'
import{File} from '../../service/model/file'
import { Router } from '@angular/router'
import { Repo } from '../../../app/service/model/repo'
export var isLogged:boolean;

@Component({
	templateUrl: './starter.component.html',
	styleUrls: ['./starter.component.css']
})

export class StarterComponent implements AfterViewInit {
	subtitle: string
	email: string
	isLogged=isLogged
	fileToUpload: File
	createrepo=false
	risp: boolean
	repos:Repo[] =null;
	selectedRepo;

	constructor(private service: Service,  public router: Router) { }

	ngOnInit() {
		if (localStorage.getItem("email") != undefined) {
			this.email = localStorage.getItem("email");
			isLogged = true;this.isLogged=isLogged
		this.getAllRepo();
		}
	}

	//funzione per prendere il file
	handleFileInput(files: File) {
		this.fileToUpload = files;
	}

//funzione per prendere tutti i repo pubblici + quelli privati dell'utente
	getAllRepo(){
		//devo richiamare la funzione del server per inviargli il file
		 this.service.getAllRepo()
		.subscribe(data => {
			this.repos = JSON.parse(data)
			for(var i=0;i<this.repos.length;i++) {
				if(this.repos[i].publicR==true){
					this.repos[i].publicR="public"
				}
				else if(this.repos[i].publicR==false){
					this.repos[i].publicR="private"
				}
			}
		}, error => {
		    console.log(error);
		});	
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

	
	sendTo(repoSelected){
		this.selectedRepo=repoSelected  
	 	for(var i=0;i<this.repos.length;i++){
			if(repoSelected.id == this.repos[i].id){
				localStorage.setItem("repoSelected.id",repoSelected.id)
			}
		}
		this.router.navigate(['/file']);
	}

	save(name){

		var state = $('input[name="statep"]:checked').val();
		if(state=="public") {
			this.risp= true; //mando true  al server, quindi la repo è pubblica
		}
		else {
			this.risp= false; //mando false al server, la repo è privata
		}

		var nameRepo = name;
 		this.service.createRepo(nameRepo,this.risp)
			.subscribe(data => {

				var newRepos=JSON.parse(data)
				this.service.getRepoSpec(newRepos.repository)

				.subscribe(data => {

					var newRepo:Repo =data
					var count = this.repos.length
					this.repos[count] = newRepo
				}, error => {
					console.log(error);
				});
				this.createrepo = false;
				alert("Repository creata con successo.")
				this.router.navigate(['/']);
     		}, error => {
				alert("Repository non creata")
	 	 }) 
	  this.createrepo=false
}

createRepo() {
	this.createrepo = true	
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