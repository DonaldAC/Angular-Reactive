import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { 
  interval, 
  noop, 
  Observable, 
  of, 
  throwError, 
  timer
} from 'rxjs';
import { 
  catchError, 
  delay, 
  delayWhen, 
  filter, 
  finalize, 
  map, 
  retryWhen, 
  shareReplay, 
  tap
} from 'rxjs/operators';
import { CourseStore } from '../services/courses.store';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    private courseStore: CourseStore,
  ) {

  }

  ngOnInit() {
    this.reloadCourses();
  }
  
  reloadCourses() {  
    this.beginnerCourses$ = this.courseStore.filterByCategory('BEGINNER');
  
    this.advancedCourses$ = this.courseStore.filterByCategory('ADVANCED');
  }
}




