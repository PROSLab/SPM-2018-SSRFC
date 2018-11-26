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

  postRegistrazione(name,surname,email,psw) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + 'registration',email, { //string da rivedere
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

  //post login 
  postLogin(email,psw) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + 'registration',email, { //string da rivedere
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


    //post recupera psw
    postRecoveryPsw(email) {
      return new Promise((resolve, reject) => {
        this.http.post(this.baseUrl + 'registration',email, { //string da rivedere
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

}