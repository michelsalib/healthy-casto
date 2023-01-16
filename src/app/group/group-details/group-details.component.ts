import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { documentId, where } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { getYear } from 'date-fns';
import { combineLatest, map, Observable, of, Subject, switchMap } from 'rxjs';
import { Group } from 'src/app/models/Group';
import { User } from 'src/app/models/User';
import { GroupsService } from 'src/app/services/db/groups.service';
import { UsersService } from 'src/app/services/db/users.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {
  dataset$: Observable<{
    group: Group;
    users: User[] | null;
    isFollowing: boolean;
  }> = new Subject();
  year = getYear(new Date())

  constructor(
    private route: ActivatedRoute,
    private userDb: UsersService,
    private groupService: GroupsService,
    private auth: Auth) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const groupId = params.get('groupId');

      if (!groupId) {
        throw 'Required group id missing';
      }

      this.dataset$ = this.groupService.get(groupId)
        .pipe(
          switchMap(group =>
            combineLatest([
              of(group),
              group.members.length ?
                this.userDb.list(where(documentId(), 'in', group.members.slice(0, 10))) :
                of([]),
            ])
          ),
          map(([group, users]) => {
            return {
              group,
              users,
              isFollowing: group.members.includes(this.auth.currentUser?.uid || ''),
            };
          })
        );
    });
  }

  follow(group: Group) {
    this.groupService.updateFollow(group.id, [...group.members, this.auth.currentUser?.uid || '']);
  }

  unfollow(group: Group) {
    this.groupService.updateFollow(group.id, group.members.filter(u => u != this.auth.currentUser?.uid));
  }

}
