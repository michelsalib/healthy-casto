import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { limitToLast, orderBy } from '@angular/fire/firestore';
import { getMonth, getYear } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/User';
import { FollowService } from '../services/db/follow.service';
import { UsersService } from '../services/db/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  readonly months;

  user$: Observable<User> = new Subject();
  recentUsers$: Observable<User[] | null> = new Subject();
  followedUsers$: Observable<User[] | null> = new Subject();

  constructor(private users: UsersService, private followService: FollowService, private auth: Auth) {
    const currentMonth = getMonth(new Date());
    const year = String(getYear(new Date()));
    this.months = [currentMonth, currentMonth + 1].map(m => year + '-' + String(m).padStart(2, '0'));
  }

  ngOnInit(): void {
    this.recentUsers$ = this.users.list(orderBy('creationDate'), limitToLast(5));
    this.followedUsers$ = this.followService.list();
    this.user$ = this.users.get(this.auth.currentUser?.uid as string);
  }

}
