import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../service/service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
  
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
   public login: boolean = false; //utente non loggato

    constructor(
        public router: Router,
        private formBuilder: FormBuilder,
        private service:Service
    ) {
       
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required,Validators.email]],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
/*         this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
 */    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit(email,psw) {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.service.loginUser(email,psw)
        .subscribe(
            data => {
               //mi salvo in uno storage locale i dati dell'utente così da poterci lavorare poi e lasciarli salvati
              localStorage.setItem('email',email)
              localStorage.setItem('password',psw)
              
               // redirect to home if already logged in
              this.router.navigate(['']);
              this.login=true;
            },
            error => {
           console.log("errore" +error)
           this.service.handleError(error)
                this.loading = false;
            });
    } 
}
