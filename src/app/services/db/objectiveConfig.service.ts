import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, deleteDoc, doc, docData, Firestore, query, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ObjectiveConfig } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveConfigService {

  constructor(private db: Firestore, private auth: Auth) {
  }

  list(userId?: string): Observable<ObjectiveConfig[]> {
    return collectionData(
      query(collection(this.db, 'users/' + (userId || this.auth.currentUser?.uid) + '/objectives') as CollectionReference<ObjectiveConfig>),
      {
        idField: 'id',
      }
    );
  }
  
}
