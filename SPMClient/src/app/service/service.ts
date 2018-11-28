import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
// import { MessageService } from './message.service';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';


///MODEL
import { User } from './model/user'
import { Router } from '@angular/router';
// ELEMENTI DA PASSARE NEL HEADER DELLE CHIAMATE
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class Service {
  private baseUrl = 'http://localhost:8080/'
  public handleError: HandleError;
  user: User

  constructor(
    public router: Router,
    private http: HttpClient, httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('Service');
  }

  // FUNZIONE GET  DA TESTING
  getTest(): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'api/user/', httpOptions);
  }

  // FUNZIONE PER AGGIUNGERE GLI UTENTI USATA IN REGISTRAZIONE
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'api/user/signin', user, httpOptions)
      .pipe(
        // UTILIZZARE LA FUNZIONE TAP QUANDO ABBIAMO NECESSITA DI UTILIZZARE I DATI DEL SUCCESSO
        tap(success => console.log(success)), 
        catchError(this.handleError('addUserFunction', user))
      );
  }

  sendEmail(email: string): Observable<string> {
    return this.http.post<string>(this.baseUrl + 'api/user/pswRecovery', email, httpOptions)
      .pipe(
        catchError(this.handleError('sendEmail', email))
      );
  }

  loginUser(email, psw): Observable<User> {
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', psw);
    return this.http.get<User>(this.baseUrl + 'api/user/login', { params: params })
      .pipe(
        tap(success => localStorage.setItem("User",success.toString() )),
        
        catchError(this.handleError<User>('loginUser'))
      );
  }

  logout() {
    console.log("hai fatto il logout. ")
        // remove user from local storage to log user out
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    this.router.navigate(['/login']);
    
  }
}









// FUNZIONE VECCHIE IN PROMISE DA CONVERTIRE COME SOPRA
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