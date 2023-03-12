import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { documentId, limitToLast, orderBy, where } from '@angular/fire/firestore';
import { format } from 'date-fns';
import { combineLatest, map, Observable, Subject, switchMap } from 'rxjs';
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
  followed$: Observable<{ users: User[] | null, groups: Group[] | null } | null> = new Subject();

  constructor(
    private users: UsersService,
    private groups: GroupsService,
    private followService: FollowService,
    private groupsService: GroupsService,
    private auth: Auth) {
    this.months = [format(new Date(), 'yyyy-MM')];
  }

  ngOnInit(): void {
    this.recents$ = combineLatest([
      this.users.list(orderBy('creationDate'), limitToLast(5)),
      this.groups.list(orderBy('creationDate'), limitToLast(5)),
    ]).pipe(map(([users, groups]) => ({ users, groups })));
    this.user$ = this.users.get(this.auth.currentUser?.uid as string);
    this.followed$ = this.user$.pipe(switchMap(u => {
      return combineLatest([
        this.followService.getFollowings(u.id, 5),
        this.groupsService.belongedGroups(u.id),
      ]);
    })).pipe(map(([users, groups]) => {
      if (!users?.length && groups?.length) {
        return null;
      }

      return ({ users, groups });
    }));
  }

}
