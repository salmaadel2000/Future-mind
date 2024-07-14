import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/register';
  private apiurl = 'http://127.0.0.1:8000/api';

  private id: number | null = null;
  private parentid: number | null = null;

  constructor(private http: HttpClient) {}

  registerUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, user).pipe(
      tap(response => {
        this.id = response.user.id;
        localStorage.setItem('id', this.id!.toString()); // تخزين id في localStorage
      })
    );
  }

  registerParent(parent: any): Observable<any> {
    if (this.id !== null) {
      parent.user_id = this.id;
      return this.http.post<any>(`${this.apiurl}/parents`, parent).pipe(
        tap(response => {
          if (response.id !== undefined) {
            this.parentid = response.id;
            localStorage.setItem('parentid', this.parentid!.toString()); // تخزين parentid في localStorage
          } else {
            console.error('Parent iD is undefined in the response.');
          }
        })
      );
    }
    throw new Error('User iD not set.');
  }

  registerChild(child: any): Observable<any> {
    if (this.parentid !== null) {
      child.parent_id = this.parentid;
      return this.http.post<any>(`${this.apiurl}/children`, child);
    }
    throw new Error('Parent iD not set.');
  }

  getid(): number | null {
    return this.id;
  }

  getParentid(): number | null {
    return this.parentid;
  }
}
