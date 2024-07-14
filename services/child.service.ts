import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Child } from '../models/child.model';

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  createChild(formData: FormData): Observable<Child> {
    return this.http.post<Child>(`${this.apiUrl}/children`, formData).pipe(
      catchError(this.handleError)
    );
  }

  getChildren(): Observable<Child[]> {
    return this.http.get<{ data: Child[] }>(`${this.apiUrl}/children`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getChild(id: number): Observable<Child> {
    return this.http.get<{ status: string, data: Child }>(`${this.apiUrl}/children/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  updateChild(id: number, formData: FormData): Observable<Child> {
    return this.http.post<Child>(`${this.apiUrl}/children/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  getParentsChildren(parentId: number): Observable<Child[]> {
    const url = `${this.apiUrl}/parents/${parentId}/children`;
    return this.http.get<Child[]>(url).pipe(
      catchError(this.handleError)
    );
  }
  updateApplicationStatus(applicationId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/${applicationId}`, { status });
  }
  
  private handleError(error: any): Observable<never> {
    console.error('ChildService error:', error);
    return throwError(error);
  }
}
