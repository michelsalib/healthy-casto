import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FollowService } from 'src/app/services/db/follow.service';

@Component({
  selector: 'app-follow-badge[userId]',
  templateUrl: './follow-badge.component.html',
  styleUrls: ['./follow-badge.component.scss']
})
export class FollowBadgeComponent implements OnInit {

  @Input() userId !: string;
  follows$: Observable<boolean> = new Subject();

  constructor(private followService: FollowService) {
  }

  ngOnInit(): void {
    this.follows$ = this.followService.isFollowing(this.userId);
  }

  async follow() {
    await this.followService.follow(this.userId);
  }

  async unfollow() {
    await this.followService.unfollow(this.userId);
  }

}
