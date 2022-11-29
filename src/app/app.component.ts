import { Component, OnInit } from '@angular/core';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map, Observable, of, Subject, switchMap } from 'rxjs';
import { User } from './models/User';
import { UsersService } from './services/db/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user$: Observable<User | null> = new Subject();;

  constructor(private auth: Auth, private router: Router, private userDb: UsersService) {
    this.user$ = authState(auth).pipe(switchMap(u => {
      if (u) {
        return this.userDb.get(u.uid);
      }
      else {
        return of<User | null>(null);
      }
    }))
  }

  async logout() {
    await signOut(this.auth);

    this.router.navigateByUrl('/login');
  }
}
