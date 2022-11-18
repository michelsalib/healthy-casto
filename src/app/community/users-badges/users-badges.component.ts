import { Component, OnInit } from '@angular/core';
import { Database, limitToLast, listVal, orderByChild, query, ref } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-users-badges',
  templateUrl: './users-badges.component.html',
  styleUrls: ['./users-badges.component.scss']
})
export class UsersBadgesComponent implements OnInit {

  users$: Observable<User[] | null>;

  constructor(public db: Database) {
    this.users$ = listVal<User>(query(
      ref(db, 'users'),
      orderByChild('creationDate'),
      limitToLast(5)
    ), {
      keyField: 'id'
    });
  }

  ngOnInit(): void {
  }

}
