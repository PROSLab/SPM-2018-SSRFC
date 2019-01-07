import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './model/user'
import { Router } from '@angular/router';
import { ChangePassword } from './model/changePassword';
import { Repo } from './model/repo';
import { Options } from 'selenium-webdriver/chrome';

// ELEMENTI DA PASSARE NEL HEADER DELLE CHIAMATE
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data"})
};

@Injectable({
  providedIn: 'root'
})

export class Service {
  private baseUrl = 'http://localhost:8080/'
  public errorMsg: string;
  user: Object;

  isLogged: boolean = false;
  id: any;
  repos: string;
  folder: string =null;

  constructor(
    public router: Router,
    private http: HttpClient,
  ) {
  }


  //@@@ SERVICE PER LE FUNZIONI DELL'UTENTE@@@//

  // FUNZIONE PER AGGIUNGERE GLI UTENTI USATA IN REGISTRAZIONE
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'api/user/signin', user, httpOptions)
      .pipe(
        // UTILIZZARE LA FUNZIONE TAP QUANDO ABBIAMO NECESSITA DI UTILIZZARE I DATI DEL SUCCESSO
        // tap(data => data),
        catchError(this.handleError)
      );
  }

  sendEmail(email: string): Observable<String> {
    let body = { email: email }
    return this.http.post<String>(this.baseUrl + 'api/user/pswRecovery', body, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  changePassword(uuid: string, pgid: string, password: string): Observable<ChangePassword> {
    let params = new HttpParams();
    params = params.append('uuid', uuid);
    params = params.append('pgid', pgid);
    params = params.append('password', password);
    return this.http.get<ChangePassword>(this.baseUrl + 'api/user/changePassword', { params: params })
      .pipe(
        catchError(this.handleError)
      );
  }
  loginUser(email, psw): Observable<User> {
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', psw);
    return this.http.get<User>(this.baseUrl + 'api/user/login', { params: params })
      .pipe(
        //tap(userLogged =>{}), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }
  logout() {
    localStorage.clear();
    alert('logout effettuato');
    this.router.navigate(['/']);
  }

  // @@@@ Service per la gestione dei file @@@@ ///
  postFile(idRepo, idUser, fileToUpload,idFolder?: File): Observable<any> {
     const formData: FormData = new FormData();
     if(idFolder!=null){
     formData.append('idFolder', idFolder); 
     }
     formData.append('idRepository', idRepo);
     formData.append('idUser', idUser);
     formData.append('files', fileToUpload)

     return this.http.post(this.baseUrl + "api/file/uploadFile",formData )
      .pipe(
        catchError(this.handleError)
      );
  }
 

  changeNameRepo(id, newRepoName): Observable<any> {
    let params = new HttpParams();
    params = params.append('idRepository', id); //id repos
    params = params.append('newRepoName', newRepoName); //name della repo nuovo
    return this.http.get(this.baseUrl + 'api/file/modifyRepoName', { params: params })
      .pipe(
        tap(success => this.user = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

   changeNameFolder(id,newRepoName): Observable<any> {
    let params = new HttpParams();
    params = params.append('idFolder', id); //id repos
    params = params.append('newFolderName', newRepoName); //name della repo nuovo
    return this.http.get(this.baseUrl + 'api/file/modifyFolderName', { params: params })
      .pipe(
        tap(success =>this.user=success), //mi salvo tutti i dati di ritorno dal server
        catchError( this.handleError)
      );
  } 

   changeNameFile(id,newRepoName): Observable<any> {
    let params = new HttpParams();
    params = params.append('idFile', id); //id repos
    params = params.append('newFileName', newRepoName); //name della repo nuovo
    return this.http.get(this.baseUrl + 'api/file/modifyFileName', { params: params })
      .pipe(
        tap(success =>this.user=success), //mi salvo tutti i dati di ritorno dal server
        catchError( this.handleError)
      );
  } 

  //get specific file,repo or folder
  getAllRepoPublic(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'api/file/getAllRepoPublic')
      .pipe(
        tap(success => this.user = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }



  getUserSpec(id): Observable<User> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get<User>(this.baseUrl + 'api/user/getUserSpec', { params: params })
      .pipe(
        tap(success => this.user = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

  getRepoSpec(id): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get<any>(this.baseUrl + 'api/file/getRepoSpec', { params: params })
      .pipe(
        tap(success => this.user = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

  getFolderSpec(id): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id); //gli passo l'id del folder
    return this.http.get(this.baseUrl + 'api/file/getFolderSpec', { params: params })
      .pipe(
        tap(success => this.user = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

  deleteVersion(id,version){
    let params = new HttpParams();
    params = params.append('idFile', id); //gli passo l'id del file
    params = params.append('version', version); //gli passo la versione del file
    return this.http.get(this.baseUrl + 'api/file/deleteVersion', { params: params, responseType: 'text' })
      .pipe(
        tap(success => this.user = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

  getFileSpec(id): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id); //gli passo l'id del file
    return this.http.get(this.baseUrl + 'api/file/getFileSpec', { params: params })
      .pipe(
        tap(success => this.user = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

  createRepo(name, state): Observable<any> {
    let params = new HttpParams();
    let id = localStorage.getItem("id")

    //id utente, se pubblico o privato e nome repo.
    params = params.append('idUser', id); //id dell'utente
    params = params.append('publicR', state); //stato della repo
    params = params.append('repositoryName', name); //nome della repo scelto

    return this.http.get(this.baseUrl + 'api/file/createRepository', { params: params, responseType: 'text' })
      .pipe(
        tap(success => localStorage.setItem("User", success.toString())),
        catchError(this.handleError)
      );
  }

  createFile(idRepository,idUser,originalName,idFolder?): Observable<any> {
    let params = new HttpParams();
    params = params.append('idUser', idUser); //nome id utente
    params = params.append('idRepository', idRepository); //id repo
    if(idFolder!=null){
    params = params.append('idFolder', idFolder); //id cartella
    }
    params = params.append('originalName', originalName); //nome del file scelto

    return this.http.get(this.baseUrl + 'api/file/createFile', { params: params, responseType: 'text' })
      .pipe(
        tap(success => this.repos = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

  createFolder(idRepository, idUser, folderName): Observable<any> {
    let params = new HttpParams();
    params = params.append('idUser', idUser); //id dell'utente
    params = params.append('idRepository', idRepository); //id della repository
    params = params.append('folderName', folderName); //nome della cartella scelto

    return this.http.get(this.baseUrl + 'api/file/createFolder', { params: params, responseType: 'text' })
      .pipe(
        tap(success => this.repos = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

  //get repositories,folders and files
  getAllRepo(): Observable<any> {
    let params = new HttpParams();
    params = params.append('idUser', localStorage.getItem("id")); //id utente
    return this.http.get(this.baseUrl + 'api/file/getAllRepo', { params: params, responseType: 'text' })
      .pipe(
        tap(success => this.repos = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

  getAllFolder(idRepository): Observable<any> {
    let params = new HttpParams();
    params = params.append('idRepository', idRepository); //id repos
    return this.http.get(this.baseUrl + 'api/file/getAllFolders', { params: params, responseType: 'text' })
      .pipe(
        tap(success => {
          this.folder = success
        }
        ), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

  getFile(idRepository,id?): Observable<any> {
    let params = new HttpParams();
    if(id!=null){
    params = params.append('idFolder', id); //id cartella
    }
    params = params.append('idRepository', idRepository); //id repo
    return this.http.get(this.baseUrl + 'api/file/getAllFile', { params: params, responseType: 'text' })
      .pipe(
        tap(success => this.user = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

  //create new version of file 

  createNewVersion(id, version): Observable<any> {
    let params = new HttpParams();
    params = params.append('idFile', id); //id del file
    params = params.append('version', version); //numero del version

    return this.http.get(this.baseUrl + 'api/file/createNewVersion', { params: params  , responseType: 'text'})
      .pipe(
        tap(success => this.user = success), //mi salvo tutti i dati di ritorno dal server
        catchError(this.handleError)
      );
  }

  //gestione errori
  private handleError(error: HttpErrorResponse) {
    console.log(error)
    if (error.status == 400) {
      alert("username o password errata")
      return throwError("Bad Credential")
    }

    if (error.status == 403) {
      alert("l'email è già in uso da un altro utente")
      return throwError("Forbidden")
    }

    if (error.status == 0) {
      alert("connessione al server fallita")
      return throwError("Server Connection failed")
    }

    if (error.status == 404) {
      alert("Account non trovato")
      return throwError("Not Found")
    }

    if (error.status == 501) {
      alert("errore di internet, riprovare")
      return throwError("Internal Server Error")
    }
  }
}