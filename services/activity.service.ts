import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://127.0.0.1:8000/api/activities';

  constructor(private http: HttpClient) {}

  getActivitiesForChild(childId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/child/${childId}`);
  }
}
