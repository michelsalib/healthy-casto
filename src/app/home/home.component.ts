import { Component, OnInit } from '@angular/core';
import { Database, ref, listVal } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users$: Observable<User[] | null>;

  constructor(db: Database) {
    this.users$ = listVal<User>(ref(db, 'users'), {
      keyField: 'id',
    });
  }

  ngOnInit(): void {
  }

}
