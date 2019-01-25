import { Component, OnInit } from '@angular/core'
import { Service } from '../../../service/service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-repo-public',
  templateUrl: './repo-public.component.html',
  styleUrls: ['./repo-public.component.css']
})


export class RepoPublicComponent implements OnInit {
  reposPublic=[];
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

      for(var x=0;x<this.reposPublic.length;x++){
      
        this.reposPublic[x].createdAt = this.reposPublic[x].createdAt.substr(0,10)
      }
   
    }, error => {
      this.errorMessage = <any>error
    });
  }
  
  
 

  //da rivedere,c ol cambiamento di route è cambiato
  sendToPublic(repoSelected) {

    this.router.navigate(['repositoryID/', repoSelected]);
  }

}
