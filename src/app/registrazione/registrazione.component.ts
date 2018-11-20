import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { Service } from '../service/service';
import { User } from '../user';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})

export class RegistrazioneComponent implements OnInit {
  service:Service
  user:User //object di tipo user per poter aggregare i dati
  errorMessage: any;

constructor() { }

ngOnInit() {}

registrazione(name,surname,email,psw) {
  window.alert(name)
  this.service.postRegistrazione(name,surname,email,psw)
    .then(
      (user: any) => {
            //do something here
      },
      error => this.errorMessage = <any>error)
  }
}
