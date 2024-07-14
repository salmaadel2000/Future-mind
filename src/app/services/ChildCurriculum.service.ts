import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Child } from '../models/child.model';
import { Subject } from '../models/subject.model';


@Injectable({
  providedIn: 'root'
})
export class ChildCurriculumService {
  private apiUrl = 'http://localhost:8000/api/curriculums';
  private baseUrl = 'http://localhost:8000/api/child-curriculums';
  private gradesUrl = 'http://localhost:8000/api/grades';
  private childrenUrl = 'http://localhost:8000/api/children';

  constructor(private http: HttpClient) {}
  
  getChildrenByCurriculum(curriculumId: number): Observable<Child[]> {
    return this.http.get<{ data: Child[] }>(`${this.apiUrl}/${curriculumId}/children`)
      .pipe(
        map(response => {
          if (Array.isArray(response.data)) {
            return response.data;
          } else {
            console.error('Response data is not an array:', response.data);
            return [];
          }
        })
      );
  }
  
  deleteChild(childId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${childId}`);
  }

  addChildToLevel(childId: number, levelId: number): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/child-curriculums';
    return this.http.post(url, { child_id: childId, curriculum_id: levelId });
  }

 
  getChildSubjects(curriculumId: number, childId: number): Observable<{ all_subjects: Subject[], child_subjects: Subject[] }> {
    return this.http.get<{ all_subjects: Subject[], child_subjects: Subject[] }>(`${this.apiUrl}/${curriculumId}/children/${childId}/subjects`);
  }

  addGrade(childId: number, subjectId: number, grade: number): Observable<any> {
    return this.http.post(this.gradesUrl, { child_id: childId, subject_id: subjectId, grade: grade });
  }
  
  getChild(childId: number): Observable<any> {
    return this.http.get<any>(`${this.childrenUrl}/${childId}`);
  }
}


