import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, deleteDoc, doc, docData, documentId, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { map, Observable, switchMap } from 'rxjs';
import { User } from 'src/app/models/User';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private db: Firestore, private auth: Auth, private userDb: UsersService) {
  }

  isFollowing(userId: string): Observable<boolean> {
    const ref = doc(this.db, 'users/' + this.auth.currentUser?.uid + '/follows/' + userId);

    return docData(ref).pipe(map(d => !!d));
  }

  list(userId?: string): Observable<User[] | null> {
    return collectionData(
      query(collection(this.db, 'users/' + (userId || this.auth.currentUser?.uid) + '/follows') as CollectionReference<{ id: string }>),
      {
        idField: 'id',
      }
    )
      .pipe(switchMap(list => {
        if (!list.length) {
          return [];
        }

        return this.userDb.list(where(documentId(), 'in', list.map(i => i.id)));
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
