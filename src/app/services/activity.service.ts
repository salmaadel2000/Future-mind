import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.model';
import { map } from 'rxjs/operators';
import { Child } from '../models/child.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://127.0.0.1:8000/api/activities';
  private childrenUrl = 'http://127.0.0.1:8000/api/children';
  private childrenWithActivitiesUrl = 'http://127.0.0.1:8000/api/children-with-activities';


  constructor(private http: HttpClient) {}

  getActivitiesForChild(childId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/child/${childId}`);
  }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  getChildren(): Observable<Child[]> {
    return this.http.get<{data: Child[]}>(this.childrenUrl).pipe(
      map(response => response.data)
    );
  }
  

  addChildToActivity(activity: { child_id: number, activity_name: string, description: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, activity);
  }

  getChildrenWithActivities(): Observable<any> {
    return this.http.get<any>(this.childrenWithActivitiesUrl);
  }


  getActivity(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  getActivityDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/details`);
  }

  createActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, activity);
  }

  updateActivity(id: number, activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${id}`, activity);
  }

  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteSimilarActivities(activityName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-similar/${activityName}`);
  }

  updateSimilarActivities(activityName: string, updatedActivity: { activity_name: string, description: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-similar/${activityName}`, updatedActivity);
  }

  addActivity(activity: { activity_name: string, description: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/simple`, activity);
  }

}
