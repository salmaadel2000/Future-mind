import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Parent } from '../models/Parent.model';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private apiUrl = 'http://127.0.0.1:8000/api/parents';
  private apiurl = 'http://127.0.0.1:8000/api/parent';
  constructor(private http: HttpClient) {}

  createParent(parent: Parent): Observable<Parent> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<Parent>(this.apiUrl, parent, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getParents(): Observable<Parent[]> {
    return this.http.get<Parent[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getParentById(id: number): Observable<Parent> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Parent>(url).pipe(
      catchError(this.handleError)
    );
  }
  updateParent(parent: Parent): Observable<Parent> {
    const url = `${this.apiUrl}/${parent.id}`;
    return this.http.put<Parent>(url, parent);
  }
  getProfileIdFromLocalStorage(): string | null {
    return localStorage.getItem('parentId');
  }
  private handleError(error: any): Observable<never> {
    console.error('ParentService error:', error);
    return throwError(error);
  }

  getAllParent(): Observable<Parent[]> {
    return this.http.get<Parent[]>(this.apiurl).pipe(
      catchError(this.handleError)
    );
  }

  deleteParent(parentId: number): Observable<any> {
    const url = `${this.apiUrl}/${parentId}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  // checkPhoneExists(phone: string): Observable<boolean> {
  //   const url = `${this.apiUrl}/check-phone/${phone}`;
  //   return this.http.get<{ exists: boolean }>(url).pipe(
  //     map(response => response.exists),
  //     catchError(this.handleError)
  //   );
  // }

  getParentByIdAdmin(parentId: number): Observable<Parent> {
    return this.http.get<Parent>(`${this.apiUrl}/${parentId}`);
  }

 
  updateParentAdmin(parent: Parent): Observable<Parent> {
    const url = `${this.apiUrl}/${parent.id}`;
    return this.http.put<Parent>(url, parent);
  }
  


  
}
