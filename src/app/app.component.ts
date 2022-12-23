import { Component } from '@angular/core';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { User } from './models/User';
import { UsersService } from './services/db/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user$: Observable<User | null> = new Subject();
;

  constructor(private auth: Auth, private router: Router, private userDb: UsersService, updates: SwUpdate, snackbar: MatSnackBar) {
    this.user$ = authState(auth).pipe(switchMap(u => {
      if (u) {
        return this.userDb.get(u.uid);
      }
      else {
        return of<User | null>(null);
      }
    }));

    updates.versionUpdates.subscribe(event => {
      switch (event.type) {
        case 'VERSION_READY':
          const snack = snackbar.open('Une nouvelle version du site est prête', 'Rafraîchir');
          snack.onAction().subscribe(() => document.location.reload());

          return;
      }
    });
  }

  async logout() {
    await signOut(this.auth);

    this.router.navigateByUrl('/login');
  }
}
