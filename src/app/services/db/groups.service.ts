import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { arrayRemove, arrayUnion, doc, Firestore, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/Group';
import { Db } from './abstract';

@Injectable({
  providedIn: 'root'
})
export class GroupsService extends Db<Group> {
  constructor(db: Firestore, private auth: Auth) {
    super(db, 'groups');
  }

  async join(groupId: string) {
    const ref = doc(this.db, 'groups/' + groupId);

    await updateDoc(ref, 'members', arrayUnion(this.auth.currentUser?.uid));
  }

  async leave(groupId: string) {
    const ref = doc(this.db, 'groups/' + groupId);

    await updateDoc(ref, 'members', arrayRemove(this.auth.currentUser?.uid));
  }

  belongedGroups(userId: string): Observable<Group[] | null> {
    return this.list(where('members', 'array-contains', userId));
  }
}
