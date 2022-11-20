import { Component, OnInit } from '@angular/core';
import { limitToLast, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/db/users.service';

@Component({
  selector: 'app-users-badges',
  templateUrl: './users-badges.component.html',
  styleUrls: ['./users-badges.component.scss']
})
export class UsersBadgesComponent implements OnInit {

  users$: Observable<User[] | null>;

  constructor(public users: UsersService) {
    this.users$ = users.list(orderBy('creationDate'), limitToLast(5));
  }

  ngOnInit(): void {
  }

}
