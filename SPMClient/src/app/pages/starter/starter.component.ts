import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { Service } from '../../service/service'
import { File } from '../../service/model/file'
import { Router } from '@angular/router'
import { Repo } from '../../../app/service/model/repo'
import { User } from '../../service/model/user';
import {ToastrService} from 'ngx-toastr'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export var exportIsLogged: boolean;
export let exportLocalUser: User;

@Component({
	templateUrl: './starter.component.html',
	styleUrls: ['./starter.component.css']
})

export class StarterComponent implements AfterViewInit {
	@ViewChild("closeModal") closeModal: ElementRef
	repoExist: boolean =null
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
	submitted: boolean=false;
	modifyNameRepoForm: FormGroup;
	
	

	constructor(private formBuilder:FormBuilder,private toastr:ToastrService,private service: Service, public router: Router) {
		this.isLogged = this.service.isLogged

	}

	ngOnInit() {
		this.modifyNameRepoForm=this.formBuilder.group({
			reponame:['',Validators.required]
		  
		  });
		this.setUser();
		this.getAllPublicRepo();
	}
	get f() { 
   
		return this.modifyNameRepoForm.controls;
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
			if (this.repos.length == 0) {
				this.repoExist = false
			}else if (this.repos.length > 0){
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

verification(){
	this.submitted = false;
	this.reset=""
}


	// SALVO IL FILE
	save(name) {

		this.submitted = true;

		if (this.modifyNameRepoForm.invalid) {
		  return;
	  }
		
		var state = $('input[name="statep"]:checked').val();
		if (state == "public") {
			this.risp = true //mando true  al server, quindi la repo è pubblica
		}
		else {
			this.risp = false //mando false al server, la repo è privata
		}
		var nameRepo = name;
		var autore = localStorage.getItem('name')+' '+localStorage.getItem('surname');
		
		this.service.createRepo(nameRepo, this.risp,autore)

			.subscribe(data => {
				this.repoExist=true

				this.toastr.success('Your repository has been successfully created', 'Create Repository')


				var newRepos = JSON.parse(data)
				this.clearModal()

			


				this.service.getRepoSpec(newRepos.repository).subscribe(data => {
					var newRepo: Repo = data
					var count = this.repos.length
					this.repos[count] = newRepo
				}, error => {
					this.errorMessage = <any>error
				});

				this.router.navigate(['/']);
			}, error => {
				        this.toastr.error('Error creating Repository', 'Errore')

				this.errorMessage = <any>error
				
			})
	}




	controlFormatFile(f) {
		if (f.name.split('.').pop() == "bpmn") {
			

			return true;
		}
		else {
			this.toastr.error('The format of the file is not correct', 'File Format')

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