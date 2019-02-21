import { Component, OnInit } from '@angular/core';
import { Service } from '../../service/service'
import { User } from '../../service/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  uuid: string;
  pgid: string;

  constructor(public toastr:ToastrService,private formBuilder: FormBuilder, private route: ActivatedRoute,private service: Service,private router:Router) {
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
    this.changePassword(this.pswRecoveryForm.value.password);
    
  }

  changePassword(password):void {
    password = this.f.password.value.trim();    
    this.service.changePassword(this.uuid,this.pgid,password)
    .subscribe(data =>{
      this.toastr.success('Password changed','Change Password')
      this.router.navigate(['/login']);
      },error => {
        this.errorMessage=<any>error
    }); 
  } 
}
