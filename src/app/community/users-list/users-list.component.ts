import { Component, OnInit } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/services/db/users.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users$: Observable<User[] | null>;

  constructor(users: UsersService) {
    this.users$ = users.list();
  }

  ngOnInit(): void {
  }

}
