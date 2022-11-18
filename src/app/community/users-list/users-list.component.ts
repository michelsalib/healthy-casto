import { Component, OnInit } from '@angular/core';
import { Database, ref, listVal } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { User } from '../../models/User';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users$: Observable<User[] | null>;

  constructor(db: Database) {
    this.users$ = listVal<User>(ref(db, 'users'), {
      keyField: 'id',
    });
  }

  ngOnInit(): void {
  }

}
