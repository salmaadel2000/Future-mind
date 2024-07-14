
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grade } from '../models/grade.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = 'http://127.0.0.1:8000/api/grades';

  constructor(private http: HttpClient) {}

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.apiUrl);
  }

  getGrade(id: number): Observable<Grade> {
    return this.http.get<Grade>(`${this.apiUrl}/${id}`);
  }
  getGradeChild(id: number): Observable<Grade[]> {
    return this.http.get<{ data: Grade[] }>(`${this.apiUrl}/child/${id}`).pipe(
      map(response => response.data)
    );
  }
  createGrade(grade: Grade): Observable<Grade> {
    return this.http.post<Grade>(this.apiUrl, grade);
  }

  updateGrade(id: number, grade: Grade): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/${id}`, grade);
  }

  deleteGrade(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
