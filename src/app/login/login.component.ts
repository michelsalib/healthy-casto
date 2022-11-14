import { Component, OnInit } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { get } from '@firebase/database';
import { User } from '../models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public auth: Auth, private router: Router, private db: Database, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  async login() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());

    await this.createUser();

    this.router.navigateByUrl('/');

    this.snackBar.open('Bienvenue sur healthy casto 👋');
  }

  private async createUser() {
    if (!this.auth.currentUser) {
      return;
    }

    const userRef = ref(this.db, 'users/' + this.auth.currentUser.uid);

    if ((await get(userRef)).exists()) {
      return;
    }

    const user: Omit<User, 'id'> = {
      creationDate: new Date().toISOString(),
      displayName: this.auth.currentUser.displayName || '',
      email: this.auth.currentUser.email|| '',
      photoURL: this.auth.currentUser.photoURL|| '',
      objectives: [],
    }

    await set(userRef, user);
  }

}

