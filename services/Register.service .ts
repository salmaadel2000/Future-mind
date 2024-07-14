import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Auth, User } from '../models/Register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/register';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<Auth> {
    return this.http.post<Auth>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  } 

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.error);
    return throwError('Something bad happened; please try again later.');
  }
}
