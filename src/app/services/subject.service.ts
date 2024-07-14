import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from '../models/subject.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = 'http://127.0.0.1:8000/api/subjects';

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }
  getSubjectById(id: number): Observable<Subject> {
    return this.http.get<{ data: Subject }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }


  getSubjectsByCurriculum(curriculumId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/curriculum/${curriculumId}`);
  }

  createSubject(subject: Subject): Observable<any> {
    return this.http.post<any>(this.apiUrl, subject);
  }

  updateSubject(subjectId: number, subjectData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${subjectId}`, subjectData);
  }

  deleteSubject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
