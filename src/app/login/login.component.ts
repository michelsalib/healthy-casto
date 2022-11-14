import { Component, OnInit } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';
import { Router } from '@angular/router';
import { get } from '@firebase/database';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public auth: Auth, public router: Router, public db: Database) { }

  ngOnInit(): void {
  }

  async login() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());

    await this.createUser();

    this.router.navigateByUrl('/');
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
    }

    await set(userRef, user);
  }

}

