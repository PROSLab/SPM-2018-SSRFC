import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { Service } from '../../../service/service';
import { User } from '../../../service/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from './must-match.validators';

@Component({
    selector: 'app-registrazione',
    templateUrl: './registrazione.component.html',
    styleUrls: ['./registrazione.component.css']
})

export class RegistrazioneComponent implements OnInit {

    registrazioneform: FormGroup;
    /* user:User //object di tipo user per poter aggregare i dati
    errorMessage: any; */
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    checkpassword = true;
    password = false;
    errorMessage: any;
    user:User;
    constructor(
        private formBuilder: FormBuilder,
        private service: Service,
        /*   private router: Router,
          private authenticationService: AuthenticationService,
          private userService: UserService,
          private alertService: AlertService */
    ) {
        // redirect to home if already logged in
        /* if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        } */
    }

    /* checkPasswords(group:FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.repeatpassword.value;
  
    return pass === confirmPass ? null : { notSame: true }     
  } */

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
        /*  this.userService.register(this.registerForm.value)
             .pipe(first())
             .subscribe(
                 data => {
                     this.alertService.success('Registration successful', true);
                     this.router.navigate(['/login']);
                 },
                 error => {
                     this.alertService.error(error);
                     this.loading = false;
                 }); */
    }

    /* registrazione() {
        console.log(this.f.name.value)
        this.service.postRegistrazione(this.f.name.value, this.f.surname.value, this.f.email.value, this.f.password.value)
            .then(
                (user: any) => {
                    console.log(user,'l\'ho fatto davvero')
                },
                error => this.errorMessage = <any>error)
    }
 */
    registrazione(user:User):void{
    this.service.postRegistrazione(user)
    .subscribe(result => console.log('success'));
    } 

    test() {
        this.service.getTest()
            .subscribe(
                data => console.log(data)
            )
    }
}