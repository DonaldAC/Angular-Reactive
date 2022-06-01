import {Component, OnInit} from '@angular/core';
import { LoadingService } from './services/loading.service';
import { MessageService } from './services/messages.service';
import { AuthStore } from './services/auth.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  /* providers: [ 
    LoadingService,
    MessageService
  ]  */ // in the dependency injection tree, this service will be available for the app and for all it's childrens.
  // this instance of the loading service will be available only for the application component and for it's child components.
})
export class AppComponent implements  OnInit {

    constructor(
      public auth: AuthStore,
    ) {

    }

    ngOnInit() {


    }

  logout() {
    this.auth.logout();
  }

}
