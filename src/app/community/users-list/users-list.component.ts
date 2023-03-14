import { Component, Inject, OnInit, Optional } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { NavigationStart, Router } from '@angular/router';
import { filter, Observable, take, takeWhile } from 'rxjs';
import { UsersService } from 'src/app/services/db/users.service';
import { User } from '../../models/User';

export interface UsersListDetailsModel {
  users$?: Observable<User[] | null>;
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users$: Observable<User[] | null>;

  constructor(
    users: UsersService,
    private router: Router,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) private data: UsersListDetailsModel,
    @Optional() private bottomSheetRef: MatBottomSheetRef<UsersListComponent>,
  ) {
    this.users$ = data?.users$ || users.list(orderBy('displayName'));

    router.events
      .pipe(
        filter(e => e instanceof NavigationStart),
        take(1),
      )
      .subscribe(() => this.bottomSheetRef?.dismiss());
  }

  ngOnInit(): void {
  }

}
