import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable, Subject } from 'rxjs';
import { Group } from 'src/app/models/Group';
import { User } from 'src/app/models/User';
import { FollowService } from 'src/app/services/db/follow.service';
import { GroupsService } from 'src/app/services/db/groups.service';
import { UsersService } from 'src/app/services/db/users.service';
import { UsersListComponent, UsersListDetailsModel } from '../users-list/users-list.component';

@Component({
  selector: 'app-community-profile',
  templateUrl: './community-profile.component.html',
  styleUrls: ['./community-profile.component.scss']
})
export class CommunityProfileComponent implements OnInit {
  userId: string = '';
  isMe: boolean = false;
  user$: Observable<User> = new Subject();
  belongedGroups$: Observable<Group[] | null> = new Subject();
  follows$: Observable<{ followersCount: number; followingCount: number; }> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private userDb: UsersService, 
    private followService: FollowService, 
    private groupsService: GroupsService,
    private bottomSheet: MatBottomSheet) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('userId');

      if (userId == this.auth.currentUser?.uid) {
        this.router.navigateByUrl('/community/me');

        return;
      }

      if (userId == 'me') {
        this.userId = this.auth.currentUser?.uid || '';
        this.isMe = true;
      }
      else {
        this.userId = userId || '';
        this.isMe = false;
      }

      this.user$ = this.userDb.get(this.userId);
      this.belongedGroups$ = this.groupsService.belongedGroups(this.userId);
      this.follows$ = combineLatest([
        this.followService.countFollowers(this.userId),
        this.user$.pipe(map(user => user.follows?.length)),
      ]).pipe(map(([followersCount, followingCount]) => {
        return { followersCount: followersCount || 0, followingCount: followingCount || 0 };
      }));
    });
  }

  openFollowers() {
    this.bottomSheet.open<UsersListComponent, UsersListDetailsModel>(UsersListComponent, {
      data: {
        users$: this.followService.getFollowers(this.userId),
      },
    });
  }

  openFollowings() {
    this.bottomSheet.open<UsersListComponent, UsersListDetailsModel>(UsersListComponent, {
      data: {
        users$: this.followService.getFollowings(this.userId),
      },
    });
  }

}
