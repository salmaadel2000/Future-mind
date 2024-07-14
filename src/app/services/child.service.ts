import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Child } from '../models/child.model';

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  createChild(formData: FormData): Observable<Child> {
    const headers = this.getHeaders();
    return this.http.post<Child>(`${this.apiUrl}/children`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getChildrenPaginate(page: number, perPage: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('perPage', perPage.toString());
    const headers = this.getHeaders();

    return this.http.get<any>(`${this.apiUrl}/children`, { params, headers }).pipe(
      map(response => {
        return {
          children: response.data,
          meta: response.meta
        };
      }),
      catchError(this.handleError)
    );
  }

  getChildren(): Observable<Child[]> {
    const headers = this.getHeaders();
    return this.http.get<{ data: Child[] }>(`${this.apiUrl}/children`, { headers }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getChild(id: number): Observable<Child> {
    const headers = this.getHeaders();
    return this.http.get<{ status: string, data: Child }>(`${this.apiUrl}/children/${id}`, { headers }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  updateChild(id: number, formData: FormData): Observable<Child> {
    const headers = this.getHeaders();
    return this.http.post<Child>(`${this.apiUrl}/children/${id}`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getParentsChildren(parentId: number): Observable<Child[]> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/parents/${parentId}/children`;
    return this.http.get<Child[]>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/applications/${applicationId}`, { status }, { headers });
  }

  deleteChild(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/children/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('ChildService error:', error);
    return throwError(error);
  }

  addChildToLevel(childId: number, levelId: number): Observable<any> {
    const headers = this.getHeaders();
    const url = 'http://127.0.0.1:8000/api/child-curriculums';
    return this.http.post(url, { child_id: childId, curriculum_id: levelId }, { headers });
  }
}
