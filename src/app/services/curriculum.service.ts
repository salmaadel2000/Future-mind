import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Curriculum } from '../models/Curriculum.model'; 
import { Child } from '../models/child.model';
import { Subject } from '../models/subject.model';
import { Grade } from '../models/grade.model';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {
  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) { }

  // get ///

  getChildDetails(childId: number): Observable<Child> {
    return this.http.get<Child>(`${this.apiUrl}/children/${childId}`);
  }


  getChildrenInClass(classId: number): Observable<Child[]> {
    return this.http.get<{ data: Child[] }>(`${this.apiUrl}/classes/${classId}/children`).pipe(
      map(response => response.data)
    );
  }


  getChildGrades(childId: number): Observable<Grade[]> {
    return this.http.get<{ data: Grade[] }>(`${this.apiUrl}/grades/child/${childId}`).pipe(
      map(response => response.data)
    );
  }
  

  addSubject(subject: Partial<Subject>): Observable<Subject> {
    return this.http.post<Subject>(`${this.apiUrl}/subjects`, subject);
  }



  updateChildGrades(childId: number, grades: { id: number; grade: number }[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/grades/child/${childId}`, grades);
  }

  getCurriculums(): Observable<Curriculum[]> {
    return this.http.get<{ data: Curriculum[] }>(`${this.apiUrl}/curriculums`).pipe(
      map(response => response.data)
    );
  }

  createCurriculum(curriculum: Curriculum): Observable<Curriculum> {
    return this.http.post<Curriculum>((`${this.apiUrl}/curriculums`), curriculum);
  }

    getSubjectsByCurriculumId(curriculumId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/subjects/curriculum/${curriculumId}`);
  }

  updateSubject(id: number, subject: Subject): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}/subjects/${id}`, subject);
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/subjects/${id}`);
  }








  
}

 

