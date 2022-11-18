import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Database, objectVal, ref, set } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$: Observable<User>;

  constructor(public auth: Auth, private db: Database, private snackBar: MatSnackBar) {
    this.user$ = objectVal(ref(db, 'users/' + auth.currentUser?.uid));
  }

  ngOnInit(): void {
  }

  async updateDisplayName(displayName: string) {
    await set(ref(this.db, 'users/' + this.auth.currentUser?.uid + '/displayName'), displayName);

    this.snackBar.open('Changements sauvegardés 👍');
  }

}
