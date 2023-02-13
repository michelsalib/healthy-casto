import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { arrayRemove, arrayUnion, collection, CollectionReference, doc, Firestore, getCountFromServer, Query, query, updateDoc, where } from '@angular/fire/firestore';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private db: Firestore, private auth: Auth, private userDb: UsersService) {
  }

  private followerQuery(userId: string): Query<{ id: string }> {
    return query(collection(this.db, 'users') as CollectionReference<{ id: string }>, where('follows', 'array-contains', userId));
  }

  async countFollowers(userId: string): Promise<number> {
    const data = await getCountFromServer(this.followerQuery(userId));

    return data.data().count;
  }

  async follow(userId: string) {
    const ref = doc(this.db, 'users/' + this.auth.currentUser?.uid);

    await updateDoc(ref, 'follows', arrayUnion(userId));
  }

  async unfollow(userId: string) {
    const ref = doc(this.db, 'users/' + this.auth.currentUser?.uid);

    await updateDoc(ref, 'follows', arrayRemove(userId));
  }
}
