import { Component, OnInit } from '@angular/core'
import { Service } from '../../../service/service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-repo-public',
  templateUrl: './repo-public.component.html',
  styleUrls: ['./repo-public.component.css']
})


export class RepoPublicComponent implements OnInit {
  reposPublic: any;
	errorMessage: any;

  constructor(private service: Service, public router: Router) {}
  
  ngOnInit() {
    this.getAllPublicRepo();
  }

  getAllPublicRepo() {
		this.service.getAllRepoPublic().subscribe(data => {
			this.reposPublic = data
		}, error => {
			this.errorMessage = <any>error
		});
	} 


	//da rivedere,c ol cambiamento di route è cambiato
  sendToPublic(repoSelected) {
	
		this.router.navigate(['repositoryID/',repoSelected]);
	}

}
