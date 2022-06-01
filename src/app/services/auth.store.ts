/* 
  We want our authentication store to be able to emit a new value for the user
  profile whenever the user loggedin successfully by calling our backend service.
  We also want to store this user profile in the local storage to keep a login state.
  Browser local storage: small key values database (We can only store and retrieve strings)
  So we are going to store our user profile in the local storage under the form 
  of serialize Json.
*/


import { Injectable } from "@angular/core";
import { User } from '../model/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, shareReplay } from 'rxjs/operators';


// Define storage key (key to save and retrieve data from local storage)
const AUTH_DATA = 'auth_data';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  private subject = new BehaviorSubject<User>(null);

  user$: Observable<User>  = this.subject.asObservable();
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(
    private http: HttpClient,
  ) {
    this.isLoggedIn$ = this.user$.pipe(
      map((user) => {
        return !!user;
      }),
    );

    this.isLoggedOut$ = this.isLoggedIn$.pipe(
      map((isLoggin) => {
        return !isLoggin;
      }),
    );

    // check the local storage at init time.
    const user = localStorage.getItem(AUTH_DATA);
    if (user) {
      this.subject.next(JSON.parse(user));
    }
  }



  login(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', {email, password})
      .pipe(
        tap((user) => {
          this.subject.next(user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(user));
        }),
        shareReplay(),
      );
  }

  logout() {
    this.subject.next(null);
    localStorage.removeItem(AUTH_DATA);
  }
}