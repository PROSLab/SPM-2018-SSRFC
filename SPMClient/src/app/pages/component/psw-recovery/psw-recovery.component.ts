import { Component, OnInit } from '@angular/core';
import { Service } from '../../../service/service'
import { User } from '../../../service/model/user';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';


@Component({
  selector: 'app-psw-recovery',
  templateUrl: './psw-recovery.component.html',
  styleUrls: ['./psw-recovery.component.css']
})

export class PswRecoveryComponent implements OnInit {
  service:Service
  user:User //object di tipo user per poter aggregare i dati
  errorMessage: any;
  submitted=false
  loading=false
pswRecoveryForm:FormGroup;
  constructor(private formBuilder:FormBuilder) {  }

  ngOnInit() {
this.pswRecoveryForm= this.formBuilder.group ({
  email: ['', [Validators.required,Validators.email]],

})
  }
  get f() { return this.pswRecoveryForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.pswRecoveryForm.invalid) {
        return;
    }

    this.loading = true;
/* recovery(email) {
  window.alert(email)
  this.service.postRecoveryPsw(email)
    .then(
      (user: any) => {
            //do something here
      },
      error => this.errorMessage = <any>error)
  } */
  }}