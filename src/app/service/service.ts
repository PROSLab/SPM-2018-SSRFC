import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import {User} from '../user'
import {Account} from '../user'
import { pipe } from '@angular/core/src/render3';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class Service {

  constructor
  (private http: HttpClient,) { }
private Url =''
errorData: {};

  getHeroes (): Observable<User[]> {
    return this.http.get<User[]>(this.Url)
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
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    this.errorData = {
      errorTitle: 'Oops! Request  failed',
      errorDesc: 'Something bad happened. Please try again later.'
    };
    return throwError(this.errorData);
  }
}
