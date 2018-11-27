import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';


///MODEL
import { User } from './model/user'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  })
};

@Injectable({
  providedIn: 'root'
})

export class Service {
  private baseUrl = 'http://localhost:8080/'
  private handleError: HandleError;
  user: User
  err:string

  constructor(
    private http: HttpClient, private messageService: MessageService, httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }


  getTest(): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'api/user/', httpOptions);
  }
  
// TOCCA CAPIRE BENE QUANDO PRENDE I VALORI come li organizza
  postRegistrazione(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'api/user/signin', user, httpOptions)
      .pipe(
        catchError(this.handleError('addUser', user))
      );
  }







  //post per prendere un utente
  //da rivedere in base al server

  /* postUser(email) {
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
  } */



  //post per far registrare un nuovo utente

  /*  postRegistrazione(name,surname,email,psw) {
     console.log('ci arrivo qui?')
     return new Promise((resolve, reject) => {
       this.http.post(this.baseUrl + 'api/user/signin', { //string da rivedere
         headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}),
         params: new HttpParams()
         .set('name', name)
         .set('surname', surname)
         .set('email', email)
         .set('password', psw)
       })
         .subscribe(res => {
           console.log(res)
           resolve(res);
         }, (err) => {
           console.log(err)
           reject(err);
         });
     })
   }  */

  /*   //post login 
     postLogin(email,psw) {
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
    }  */


  /* //post recupera psw
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
  } */
}