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

  constructor(private service: Service, public router: Router) {
    
   }
  errorMessage: any;
  

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


  sendToPublic(repoSelected) {
		for (var i = 0; i < this.reposPublic.length; i++) {
			if (repoSelected.id == this.reposPublic[i].id) {
				localStorage.setItem("repoSelected.id", repoSelected.id)
			}
		}
		this.router.navigate(['/folder']);
	}

}
