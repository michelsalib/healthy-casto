import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { arrayRemove, arrayUnion, collection, collectionData, CollectionReference, doc, documentId, Firestore, getCountFromServer, Query, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable, switchMap } from 'rxjs';
import { User } from 'src/app/models/User';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private db: Firestore, private auth: Auth, private userDb: UsersService) {
  }

  private followerQuery(userId: string): Query<User> {
    return query(collection(this.db, 'users') as CollectionReference<User>, where('follows', 'array-contains', userId));
  }

  async countFollowers(userId: string): Promise<number> {
    const data = await getCountFromServer(this.followerQuery(userId));

    return data.data().count;
  }

  getFollowers(userId: string): Observable<User[]> {
    return collectionData(this.followerQuery(userId), {
      idField: 'id',
    });
  }

  getFollowings(userId: string): Observable<User[] | null> {
    return this.userDb.get(userId).pipe(
      switchMap(user => {
        return this.userDb.list(where(documentId(), 'in', user.follows.slice(0, 10)));
      })
    );
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
