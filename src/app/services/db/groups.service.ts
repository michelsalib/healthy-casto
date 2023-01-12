import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Group } from 'src/app/models/Group';
import { Db } from './abstract';

@Injectable({
  providedIn: 'root'
})
export class GroupsService extends Db<Group> {

  constructor(db: Firestore, private auth: Auth) {
    super(db, 'groups');
  }

  async updateFollow(groupId: string, users: string[]) {
    const ref = doc(this.db, 'groups/' + groupId);

    await updateDoc(ref, 'members', users);
  }
}
