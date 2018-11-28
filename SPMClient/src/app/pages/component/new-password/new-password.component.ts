import { Component, OnInit } from '@angular/core';
import { Service } from '../../../service/service'
import { User } from '../../../service/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  service: Service
  user: User //object di tipo user per poter aggregare i dati
  errorMessage: any;
  submitted = false
  loading = false
  pswRecoveryForm: FormGroup;



  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) {
    //QUERY PER OTTENERE I VALORI DALL'URL
    var email;var password;
    this.route.queryParams.subscribe(params => {
      email = params['email'];
      password = params['password'];
      console.log(email,password,params)
    });
  }

  ngOnInit() {
    this.pswRecoveryForm = this.formBuilder.group({
      password: ['', [Validators.required]],
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
    //a questo punto il client invirà al srever lanuova password dell'utente
    //....
  }
}
