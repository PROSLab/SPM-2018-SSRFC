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

  constructor(private service: Service, public router: Router) { }

  ngOnInit() {
    this.getAllPublicRepo();
  }

 /*  takeAll() {
    return new Promise((resolve, reject) => {
      this.service.getAllRepoPublic().subscribe(data => {
        this.reposPublic = data
        console
        resolve(true)
      }, error => {
        this.errorMessage = <any>error
        return false
      });
    }).then(res)=>{

    }
  } */


  getAllPublicRepo() {
    this.service.getAllRepoPublic().subscribe(data => {
      this.reposPublic = data
      console.log(this.reposPublic)
    }, error => {
      this.errorMessage = <any>error
    });
  }


  //da rivedere,c ol cambiamento di route è cambiato
  sendToPublic(repoSelected) {

    this.router.navigate(['repositoryID/', repoSelected]);
  }

}
