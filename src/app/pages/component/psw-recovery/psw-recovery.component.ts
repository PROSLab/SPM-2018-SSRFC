import { Component, OnInit } from '@angular/core';
import { Service } from '../../../service/service'
import { User } from '../../../service/model/user';

@Component({
  selector: 'app-psw-recovery',
  templateUrl: './psw-recovery.component.html',
  styleUrls: ['./psw-recovery.component.css']
})

export class PswRecoveryComponent implements OnInit {
  service:Service
  user:User //object di tipo user per poter aggregare i dati
  errorMessage: any;

  constructor() { }

  ngOnInit() {
  }

recovery(email) {
  window.alert(email)
  this.service.postRecoveryPsw(email)
    .then(
      (user: any) => {
            //do something here
      },
      error => this.errorMessage = <any>error)
  }
}