import { Component, OnInit, } from '@angular/core';
import { Service } from '../../service/service';
import { User } from '../../service/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from './must-match.validators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-registrazione',
    templateUrl: './registrazione.component.html',
    styleUrls: ['./registrazione.component.css']
})

export class RegistrazioneComponent implements OnInit {

    registrazioneform: FormGroup;
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    checkpassword = true;
    password = false;
    user: User;
    error: boolean;
    errorMsg: any;

    constructor(
        private toastr:ToastrService,
        private formBuilder: FormBuilder,
        private service: Service,
        private router: Router,
    ) {

    }
    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, {
                validator: MustMatch('password', 'confirmPassword')
            });
    }
    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.loading = true;
        this.addUser(this.f.name.value, this.f.surname.value, this.f.email.value, this.f.password.value)
    }

    // CHIAMATA POST PER LA REGISTRAZIONE
    addUser(name: string, surname: string, email: string, password: string): void {
        //rimuove gli spazi all'inizio ed alla fine della stringa
        name = this.f.name.value.trim();
        surname = this.f.surname.value.trim();
        email = this.f.email.value.trim();
        password = this.f.password.value.trim();
        // verifica se sono diversi da null
        if (!email && !name && !surname && !password) { return; }
        // Crea il nuovo utente con i valori asseggnati
        const newUser: User = { name, surname, email, password } as User;
        this.service.addUser(newUser)
        .subscribe( data => {

            this.toastr.success('You have successfully registered, now you can login', 'Sign up')

            setTimeout(()=>{
                this.router.navigate(['/login']);}, 2000); 
            
        },error => {
            this.error = true;
            this.errorMsg = error
            this.loading = false;
        });
    }
}