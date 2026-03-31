import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/cursos';

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.API_URL);
  }

  getById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.API_URL}/${id}`);
  }

  create(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.API_URL, course);
  }

  update(id: number, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.API_URL}/${id}`, course);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
