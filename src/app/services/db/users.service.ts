import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { User } from 'src/app/models/User';
import { Db } from './abstract';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends Db<User> {

  constructor(db: Firestore) {
    super(db, 'users');
  }
}
