// Stateless observable base service (Design pattern): means our service does not hold any application data.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';

@Injectable({
  providedIn: 'root'
})
export class CoursesService{
  constructor(
    private http: HttpClient,
  ) {}

  loadCourseById(courseId: number): Observable<Course>{
    return this.http.get<Course>(`/api/courses/${courseId}`)
      .pipe(
        shareReplay(),
      )
  }

  loadAllCoursesLesson(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`/api/lessons`, {
      params: {
        pageSize: '10000',
        courseId: courseId.toString(),
      }
    }).pipe(
      map((response) => {
        return response['payload'];
      }),
      shareReplay(),
    );
  }

  getAllCourses(): Observable<Course[]> {
    // We dont keep any reference of the data that's get retrieve from the backend, the data get return to the caller directly(stateless)
    return this.http.get<Course[]>('/api/courses')
      .pipe(
        map((response: any) => {
          return response.payload;
        }),
        shareReplay(),
      );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
       shareReplay(),
      )
  }

  searchLesson(search: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>('/api/lessons', {
      params: {
        filter: search,
        pageSize: '100'
      }
    }).pipe(
      map((response) => {
        return response['payload'];
      }),
      shareReplay()
    );
  }
}