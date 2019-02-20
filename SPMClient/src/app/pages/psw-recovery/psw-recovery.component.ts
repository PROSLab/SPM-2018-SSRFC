import { Component, OnInit } from '@angular/core';
import { Service } from '../../service/service'
import { User } from '../../service/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-psw-recovery',
  templateUrl: './psw-recovery.component.html',
  styleUrls: ['./psw-recovery.component.css']
})

export class PswRecoveryComponent implements OnInit {
  
  user: User //object di tipo user per poter aggregare i dati
  errorMessage: any;
  submitted = false
  loading = false
  pswRecoveryForm: FormGroup;
  http: any;
  constructor(private formBuilder: FormBuilder,private service: Service,  private toastr:ToastrService) {
    
   }

  ngOnInit() {
    this.pswRecoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],

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
  }
  sendEmail(email: string): void {
    //rimuove gli spazi all'inizio ed alla fine della stringa
    email = this.f.email.value.trim();
    // verifica se è diversa da null
    if (!email)  return; 
    this.service.sendEmail(email)
    //TESTING rimuovere il contenuto della parentesi quando si è verificata la funzione
    .subscribe(_=>{
      this.toastr.success('Email sent', 'Success')
      this.loading = false;},
      error =>{
        this.toastr.error('Email error', 'Error')
      });
    return;
}
}