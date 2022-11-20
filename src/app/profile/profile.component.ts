import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { UsersService } from '../services/db/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$: Observable<User>;

  constructor(public auth: Auth, private db: Firestore, private usersService: UsersService,  private snackBar: MatSnackBar) {
    this.user$ = this.usersService.get(auth.currentUser?.uid as string);
  }

  ngOnInit(): void {
  }

  async updateDisplayName(displayName: string) {
    await updateDoc(doc(this.db, 'users/' + this.auth.currentUser?.uid), 'displayName', displayName);

    this.snackBar.open('Changements sauvegardés 👍');
  }

}
