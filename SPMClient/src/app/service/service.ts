import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


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
  public errorMsg: string;
  user: User
  isLogged:boolean=false;

  constructor(
    public router: Router,
    private http: HttpClient,
  ) {
  }

  // FUNZIONE GET  DA TESTING
  getTest(): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'api/user/', httpOptions);
  }

  // FUNZIONE PER AGGIUNGERE GLI UTENTI USATA IN REGISTRAZIONE
  addUser(user: User): Observable<any> {
    return this.http.post(this.baseUrl + 'api/user/signin', user, httpOptions)
      .pipe(
        // UTILIZZARE LA FUNZIONE TAP QUANDO ABBIAMO NECESSITA DI UTILIZZARE I DATI DEL SUCCESSO
        tap(success => console.log(success)),
        catchError(this.handleError)
      );
  }

  sendEmail(email: string): Observable<any> {
    let body = {email:email}
    return this.http.post(this.baseUrl + 'api/user/pswRecovery',body, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  changePassword(uuid:string,pgid:string,password:string){
    //DECOMMENTARE QUANDO LA FUNZIONE SERVER SARA ON
    /*let body = {
      uuid:uuid,
      pgid:pgid,
      password:password,
    }
      return this.http.post(this.baseUrl + 'api/user/changePassword',body, httpOptions)
      .pipe(
        catchError(this.handleError)
      ); */
      
  } 
  

  loginUser(email, psw): Observable<any> {
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', psw);
    return this.http.get(this.baseUrl + 'api/user/login', { params: params })
      .pipe(
        tap(success => localStorage.setItem("User", success.toString())),
        catchError(this.handleError)
      );
  }

  logout() {
    localStorage.clear();
    alert('logout effettuato')
    /* location.reload() */
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status == 400) {
      return throwError("Bad Credential")
    }
    if (error.status == 0) {
      return throwError("Server Connection failed")
    }
    if (error.status == 404) {
      return throwError("Not Found")
    }
    if (error.status == 501) {
      return throwError("Internal Server Error")
    }
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