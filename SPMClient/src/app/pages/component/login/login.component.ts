import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../service/service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']

})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;// PER l'immagine
    submitted = false;
    error = false
    returnUrl: string;
    public login: boolean = false; //utente non loggato
    errorMsg: string;

    constructor(
        public router: Router,
        private formBuilder: FormBuilder,
        private service: Service
    ) {

    }

    ngOnInit() {
        
        localStorage.setItem("logged","false")

        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
/*         this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
 */    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit(email, psw) {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.service.loginUser(email, psw).pipe()
            .subscribe(data => {

                //in "data" abbiamo tutti i dati dell'utente
                //li salviamo in locale
                localStorage.setItem("logged","true")
                localStorage.setItem("id", data.id)
                localStorage.setItem("name", data.name)
                localStorage.setItem("surname", data.surname)
                localStorage.setItem("email", data.email)
                localStorage.setItem("password", data.password)
                // redirect to home
                this.login = true;
                alert('login done!')

                this.router.navigate(['']);

            }, error => {
                this.error = true;
                this.errorMsg = error
                this.loading = false;
            });
    }
}
