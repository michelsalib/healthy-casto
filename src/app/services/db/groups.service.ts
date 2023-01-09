import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Group } from 'src/app/models/Group';
import { Db } from './abstract';

@Injectable({
  providedIn: 'root'
})
export class GroupsService extends Db<Group> {

  constructor(db: Firestore) {
    super(db, 'groups');
  }
}
