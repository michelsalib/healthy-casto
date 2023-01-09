import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { limitToLast, orderBy } from '@angular/fire/firestore';
import { format } from 'date-fns';
import { combineLatest, map, Observable, Subject } from 'rxjs';
import { Group } from '../models/Group';
import { User } from '../models/User';
import { FollowService } from '../services/db/follow.service';
import { GroupsService } from '../services/db/groups.service';
import { UsersService } from '../services/db/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  readonly months;

  user$: Observable<User> = new Subject();
  recents$: Observable<{ users: User[] | null, groups: Group[] | null } | null> = new Subject();
  followedUsers$: Observable<User[] | null> = new Subject();

  constructor(private users: UsersService, private groups: GroupsService, private followService: FollowService, private auth: Auth) {
    const currentMonth = format(new Date(), 'yyyy-MM');
    // const previousMonth = format(addMonths(new Date(), -1), 'yyyy-MM');

    this.months = [
      // previousMonth,
      currentMonth,
    ];
  }

  ngOnInit(): void {
    this.recents$ = combineLatest([
      this.users.list(orderBy('creationDate'), limitToLast(6)),
      this.groups.list(orderBy('creationDate'), limitToLast(6)),
    ]).pipe(map(([users, groups]) => ({users, groups})));
    this.followedUsers$ = this.followService.list();
    this.user$ = this.users.get(this.auth.currentUser?.uid as string);
  }

}
