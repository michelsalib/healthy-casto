import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { map, Observable, Subject } from 'rxjs';
import { FollowService } from 'src/app/services/db/follow.service';
import { UsersService } from 'src/app/services/db/users.service';

@Component({
  selector: 'app-follow-badge[userId]',
  templateUrl: './follow-badge.component.html',
  styleUrls: ['./follow-badge.component.scss']
})
export class FollowBadgeComponent implements OnInit {

  @Input() userId !: string;
  follows$: Observable<boolean> = new Subject();

  constructor(private followService: FollowService,
    private userService: UsersService,
    private auth: Auth) {
  }

  ngOnInit(): void {
    this.follows$ = this.userService.get(this.auth.currentUser?.uid as string)
      .pipe(map(u => u.follows?.includes(this.userId)));
  }

  async follow() {
    await this.followService.follow(this.userId);
  }

  async unfollow() {
    await this.followService.unfollow(this.userId);
  }

}
