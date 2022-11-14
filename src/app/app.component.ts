import { Component } from '@angular/core';
import { Database, objectVal, ref } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'healthy-casto';
  user$: Observable<any>;

  constructor(db: Database) {
    this.user$ = objectVal(ref(db, 'users/Michel'));
  }
}
