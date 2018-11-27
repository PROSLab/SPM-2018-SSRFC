import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse, HttpParams } from '@angular/common/http';
import {User} from './model/user'
import {Account} from './model/user'
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})

export class Service {

  constructor(private http: HttpClient) { }
  private baseUrl =''
  errorData: {};
  user:User
  account:Account

  //post per prendere un utente
  //da rivedere in base al server
  postUser(email) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + 'user', email, { //string da rivedere
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        params: new HttpParams().set('id', this.user.toString()),
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }

  //post per far registrare un nuovo utente

  postRegistrazione(name,surname,email,password) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + 'registration', { //string da rivedere
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        params: new HttpParams().set('name', name.toString()).set('surname', surname.toString()).set('email', email.toString()).set('password', password.toString()),
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }

  //post login 
  postLogin(email,password) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + 'registration', { //string da rivedere
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        params: new HttpParams().set('email', email.toString()).set('password', password.toString()),
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }


    //post recupera psw, gli passo l'email
    //controllare la risposta
    postRecoveryPsw(email) {
      return new Promise((resolve, reject) => {
        this.http.post(this.baseUrl + 'password/forgot', { //string da rivedere
          headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
          params: new HttpParams().set('email', email.toString()),
        })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      })
    }


    postchangePsw(hash,id,newPassword) {
      return new Promise((resolve, reject) => {
        this.http.post(this.baseUrl + 'password/forgot', { //string da rivedere
          headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
          params: new HttpParams().set('hash', hash.toString()).set('id', id.toString()).set('newPassword', newPassword.toString()),
        })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      })
    }


}