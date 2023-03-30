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
import { random } from 'lodash';

const MESSAGES = [
  'Profite de chaque moment de ta journée ! 💅',
  'Tu es capable d\'accomplir de grandes choses ! 🦄',
  'Bienvenue dans notre oasis de bien-être 🥰',
  'Tu es sur la bonne voie, continue comme ça ! 💐',
  'Prends soin de toi, tu le mérites ! 💖',
  'Chaque effort est une occasion de célébrer, fais la fête ! 🍾',
  'Tu as le vent en poupe aujourd’hui ! 🏃‍♀️',
  'Continue sur ta lancée ! 💪',
  'Ton bien-être est un voyage, pas une destination. ✈️',
  'Let’s goooooooooo 🌈'
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  readonly months;
  welcomeMessage = MESSAGES[random(MESSAGES.length)];
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
