import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, deleteDoc, doc, docData, documentId, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
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
    const collator = new Intl.Collator();

    return collectionData(
      query(collection(this.db, 'users/' + (userId || this.auth.currentUser?.uid) + '/follows') as CollectionReference<{ id: string }>),
      {
        idField: 'id',
      }
    )
      .pipe(
        filter(list => !!list.length),
        switchMap(list => this.userDb.list(where(documentId(), 'in', list.slice(0, 10).map(i => i.id)))),
        tap(list => list?.sort((a, b) => collator.compare(a.displayName, b.displayName))),
      );
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
