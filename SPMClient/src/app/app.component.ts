import { Component } from '@angular/core';
 import { Service } from './service/service';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project';
  
  constructor( private service: Service)  { 
      if(localStorage.getItem('isLogged')=='true'){
      service.isLogged=true;
    }else{
      service.isLogged=false;
    } 
  }
}
