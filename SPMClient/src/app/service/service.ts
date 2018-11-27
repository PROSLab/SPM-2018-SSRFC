import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {User} from './model/user'
/* import {Account} from './model/user'*/
import { FormGroup } from '@angular/forms';
import { Observable , throwError } from 'rxjs';
import {retry,catchError } from 'rxjs/operators'


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin':'*',
  })
};

@Injectable({
  providedIn: 'root'
})
export class Service {
  
  private baseUrl ='http://localhost:8080/'
  errorData: {};
  user:User
  constructor(private http: HttpClient) { }

  getTest(): Observable<User> {
    return this.http.get<User>(this.baseUrl+'api/user',httpOptions);
  }

  postRegistrazione(user:User):Observable<User>{
    return this.http.post<User>(this.baseUrl+'api/user/signin', user, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };





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