import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
// import { CoursesService } from '../services/courses.services';
// import { LoadingService } from '../services/loading.service';
import { MessageService } from '../services/messages.service';
import { CourseStore  } from '../services/courses.store';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [
        // LoadingService,
        MessageService,
    ],
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course:Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        // private coursesService: CoursesService,
        // private loadingService: LoadingService,
        private messageService: MessageService,
        private courseStore: CourseStore,
    ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });


    }

    ngAfterViewInit() {

    }

    save() {
      const changes = this.form.value;

      this.courseStore.saveCourse(this.course.id, changes)
        .subscribe();

        this.dialogRef.close(changes);
    }

    close() {
        this.dialogRef.close();
    }

}
