import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { documentId, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, switchMap } from 'rxjs';
import { User } from 'src/app/models/User';
import { FollowService } from 'src/app/services/db/follow.service';
import { UsersService } from 'src/app/services/db/users.service';

@Component({
  selector: 'app-community-profile',
  templateUrl: './community-profile.component.html',
  styleUrls: ['./community-profile.component.scss']
})
export class CommunityProfileComponent implements OnInit {
  userId: string = '';
  isMe: boolean = false;
  user$: Observable<User> = new Subject();
  followedUsers$: Observable<User[] | null> = new Subject();

  constructor(private route: ActivatedRoute, private router: Router, private auth: Auth, private userDb: UsersService, private followService: FollowService) { }

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
      this.followedUsers$ = this.followService.list(this.userId);
    });
  }

}
