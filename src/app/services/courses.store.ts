/*
  The course store service is a statefull service which mean it keep some state of our application
  (here the list of course from the backend). This service load the courses from the backend
  and emit them via the courses observable, whenever it's instantiate for the first time.
*/
import { Injectable } from "@angular/core";
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { MessageService } from '../services/messages.service';
import { catchError, tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseStore {
  private subject = new BehaviorSubject<Course[]>([]);
  
  courseStore$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messageService: MessageService,
  ) {
    this.loadAllCourses();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courseStore$
      .pipe(
        map(
          (courses) => courses.filter((course) => {
            return course.category === category;
          })
          .sort(sortCoursesBySeqNo),
        ),
      );
  }
/* 
   Data modification in a optimistic way = data modification of the data directly in memory
   and emit the new value of the data via the course$ observable immediatly.
   So we are not going to wait until the data get save to the backend before modifying the rest of the application.
 */
  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();
    
    const index = courses.findIndex((course) => course.id === courseId);
    
    const newCourse: Course = {
      ...courses[index],
      ...changes
    }; 

    const newCourses: Course[] = courses.slice(0);

    newCourses[index] = newCourse;
    
    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError((err) => {
          const message = 'Could not save course';
          this.messageService.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        shareReplay(),
      );
  }

  private loadAllCourses() {
    const courses$ = this.http.get<Course[]>('/api/courses')
      .pipe(
        map((response) => {
          return response['payload'];
        }),
        catchError((err) => {
          const message = 'Could not load courses';
          this.messageService.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap((courses) => {
          return this.subject.next(courses);
        })
      );

      this.loadingService.showLoaderUntilCompleted(courses$)
        .subscribe();
  }
}