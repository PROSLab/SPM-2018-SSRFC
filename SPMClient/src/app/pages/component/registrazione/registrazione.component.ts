import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { Service } from '../../../service/service';
import { User } from '../../../service/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})

export class RegistrazioneComponent implements OnInit {
  
  registrazioneform:FormGroup;
  /* user:User //object di tipo user per poter aggregare i dati
  errorMessage: any; */
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  checkpassword=true;
password=false;
  constructor(
      private formBuilder: FormBuilder,
      private service:Service,
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
checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  let pass = group.controls.password.value;
  let confirmPass = group.controls.repeatpassword.value;

  return pass === confirmPass ? null : { notSame: true }     
  
}
  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          username: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(6)]],
          repeatpassword : ['', Validators.required ] 
        }, {validator: this.checkPasswords });
      
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
      
console.log(this.registerForm.controls)
      this.submitted = true;
      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }
      this.checkpassword= false;
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

 /* registrazione(name,surname,email,psw) {
  window.alert(name)
  this.service.postRegistrazione(this.f.name.value,this.f.surname.value,this.f.email.value,this.f.password.value)
    .then(
      (user: any) => {
            //do something here
      },
      error => this.errorMessage = <any>error)
  }*/ 
 
}