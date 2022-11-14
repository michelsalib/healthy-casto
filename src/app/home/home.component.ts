import { Component, OnInit } from '@angular/core';
import { Database, objectVal, ref } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user$: Observable<any>;

  constructor(db: Database) {
    this.user$ = objectVal(ref(db, 'users/Michel'));
  }

  ngOnInit(): void {
  }

}
