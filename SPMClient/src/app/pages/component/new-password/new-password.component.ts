import { Component, OnInit } from '@angular/core';
import { Service } from '../../../service/service'
import { User } from '../../../service/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  user: User //object di tipo user per poter aggregare i dati
  errorMessage: any;
  submitted = false
  loading = false
  pswRecoveryForm: FormGroup;
  password: string;
  uuid: string;
  pgid: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,private service: Service,private router:Router) {
    //QUERY PER OTTENERE I VALORI DALL'URL

    this.route.queryParams.subscribe(params => {
      this.uuid = params['uuid'];
      this.pgid = params['pgid'];
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
    this.changePassword();
    alert('Password cambiata');
  }

  changePassword():void {
    this.password = this.f.password.value.trim();
    this.router.navigate(['']);
    
     //TESTING rimuovere il contenuto della parentesi quando si è verificata la funzione
     /* 
     this.service.changePassword(this.uuid,this.pgid,this.password)
     .subscribe(data => {this.router.navigate(['']);},
     */
     return;
  }
}
