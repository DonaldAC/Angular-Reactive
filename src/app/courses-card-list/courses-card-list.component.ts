import { 
  Component, 
  Input, 
  OnInit, 
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { Course } from '../model/course';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { filter, tap } from 'rxjs/operators';


@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrls: ['./courses-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesCardListComponent implements OnInit {

  @Input()
  courses: Course[] = [];

  @Output()
  courseChanged = new EventEmitter()


  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }


  editCourse(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(
      filter((res) => !!res),
      tap(() => this.courseChanged.emit()),
    )
    .subscribe();
  }

}
