import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Auth, Login } from '../models/Register.model';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Loginservice {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/login'; 
  private tokenKey = 'access_token';

  constructor(private http: HttpClient, private router: Router) {}

  login(loginData: Login): Observable<Auth> {
    return this.http.post<Auth>(this.apiUrl, loginData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('LoginService error:', error);
    return throwError(error);
  }

  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('id');
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.role === 'admin';
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }  
}
