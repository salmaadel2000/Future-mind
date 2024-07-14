import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Package } from '../models/package.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = 'http://127.0.0.1:8000/api/packages';

  constructor(private http: HttpClient) { }

  getPackages(): Observable<Package[]> {
    return this.http.get<{ data: Package[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getPackage(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.apiUrl}/${id}`);
  }

  addPackage(newPackage: Package): Observable<Package> {
    return this.http.post<Package>(this.apiUrl, newPackage);
  }

  updatePackage(updatedPackage: Package): Observable<Package> {
    return this.http.put<Package>(`${this.apiUrl}/${updatedPackage.id}`, updatedPackage);
  }

  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
