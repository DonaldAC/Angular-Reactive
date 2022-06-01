// the purpose of this service is to enable communication between the loading component
// and other part of the application that want to display the loading indicator.
// So this is all about component communication.
// To achieve this goal, this service need to be injected in the loading component and any other
// part of the application that want to display the loading indicator.
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, concatMap, finalize } from 'rxjs/operators';


@Injectable() // Because we didn't set the provided in property, we need to define where this service will be available in our DI tree, we do that in the app component.
export class LoadingService {
  // The BehaviorSubject() is a special type of subject that remember the last values emitted by the subject.
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // The return observable is going to have loading capabilities.
  // this method should be compatible for observable of any type.(<T> mean type safe code compatible with any type of observables)
  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null) // while the input observable doesn't initiate it's life cycle, we create another observable that's going to emit a value, which value will be use to trigger the loading indicator.
      .pipe(
        tap(() => this.loadingOn()),    // the tap() operator help to trigger a side effect.
        concatMap(() => obs$),          // emit the values emitted by the input observable.
        finalize(() => this.loadingOff()),
      );
  } 

  /* 
    these methods enable us to turn on or off the loading indicator
    at any moment from anywhere in the application.(In a way that is link to the 
      life cycle of an observable.)
   */

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}




/* 
  We want to provide via this service a convinient way for different parts of the application
  for trigger the loading indicator without any of the multiple parts of the application (such of 
  the home component etc.) to be directly aware of the existance of the loading component.
  The most important part of the loading API is the "loading$" observable (because our service
  is design in the reactive way.). this observable is going to emit "true" when we want to show the 
  loading indicator to the user and "false" when we want to hide the loading indicator to the user.

 */
