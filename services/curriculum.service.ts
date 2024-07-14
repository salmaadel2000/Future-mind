import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curriculum } from '../models/Curriculum.model'; 
import { Class } from '../models/Class.model';
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

  getCurriculums(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(`${this.apiUrl}/curriculums`);
  }

  getClassDetails(classId: number): Observable<Class> {
    return this.http.get<Class>(`${this.apiUrl}/classes/${classId}`);
  }

  getChildrenInClass(classId: number): Observable<Child[]> {
    return this.http.get<Child[]>(`${this.apiUrl}/classes/${classId}/children`);
  }

  getChildGrades(childId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/grades/child/${childId}`);
  }

  getChildDetails(childId: number): Observable<Child> {
    return this.http.get<Child>(`${this.apiUrl}/children/${childId}`);
  }

  getLevelSubjects(levelId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/subjects/level/${levelId}`);
  }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/activities`);
  }

  /// add //

  addSubject(subject: Partial<Subject>): Observable<Subject> {
    return this.http.post<Subject>(`${this.apiUrl}/subjects`, subject);
  }

  addClass(cls: Partial<Class>): Observable<Class> {
    return this.http.post<Class>(`${this.apiUrl}/classes`, cls);
  }

  addActivity(activity: Partial<Activity>): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}/activities`, activity);
  }


// update //
  updateSubject(subjectId: number, subject: Partial<Subject>): Observable<any> {
    return this.http.put(`${this.apiUrl}/subjects/${subjectId}`, subject);
  }
  
  updateClass(classId: number, cls: Partial<Class>): Observable<any> {
    return this.http.put(`${this.apiUrl}/classes/${classId}`, cls);
  }
  
  updateActivity(activityId: number, activity: Partial<Activity>): Observable<any> {
    return this.http.put(`${this.apiUrl}/activities/${activityId}`, activity);
  }
  

  updateChildGrades(childId: number, grades: { [subjectId: number]: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/children/${childId}/grades`, { grades });
  }


  //delete //

  deleteSubject(subjectId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/subjects/${subjectId}`);
  }

  deleteClass(classId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/classes/${classId}`);
  }


  

  deleteActivity(activityId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/activities/${activityId}`);
  }
}
