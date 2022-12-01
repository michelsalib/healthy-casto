import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, deleteDoc, doc, docData, Firestore, query, setDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private db: Firestore, private auth: Auth) {
  }

  isFollowing(userId: string): Observable<boolean> {
    const ref = doc(this.db, 'users/' + this.auth.currentUser?.uid + '/follows/' + userId);

    return docData(ref).pipe(map(d => !!d));
  }

  list(userId?: string): Observable<string[]> {
    return collectionData(
      query(collection(this.db, 'users/' + (userId || this.auth.currentUser?.uid) + '/follows') as CollectionReference<{ id: string }>),
      {
        idField: 'id',
      }
    ).pipe(map(d => {
      return d.map(d => d.id);
    }));
  }

  async follow(userId: string) {
    const ref = doc(this.db, 'users/' + this.auth.currentUser?.uid + '/follows/' + userId);

    await setDoc(ref, {});
  }

  async unfollow(userId: string) {
    const ref = doc(this.db, 'users/' + this.auth.currentUser?.uid + '/follows/' + userId);

    await deleteDoc(ref);
  }
}
