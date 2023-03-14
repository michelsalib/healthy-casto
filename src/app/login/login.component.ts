import { Component, OnInit } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public auth: Auth, private router: Router, private db: Firestore, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  async login() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());

    await this.createUser();

    this.router.navigateByUrl('/');

    this.snackBar.open('Bienvenue sur healthy casto 👋', undefined, { duration: 3000, verticalPosition: 'top' });
  }

  private async createUser() {
    if (!this.auth.currentUser) {
      return;
    }

    const userRef = doc(this.db, 'users/' + this.auth.currentUser.uid);

    if ((await getDoc(userRef)).exists()) {
      return;
    }

    const user: Omit<User, 'id'> = {
      creationDate: Timestamp.now(),
      displayName: this.auth.currentUser.displayName || '',
      email: this.auth.currentUser.email || '',
      photoURL: this.auth.currentUser.photoURL || '',
      follows: [],
    };

    await setDoc(userRef, user);
  }

}

