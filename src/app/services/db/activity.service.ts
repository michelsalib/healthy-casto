import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, deleteField, doc, Firestore, getDoc, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { documentId } from '@firebase/firestore';
import { addMonths, format, parse } from 'date-fns';
import { map, Observable } from 'rxjs';
import { ActivityEntry } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private db: Firestore, private auth: Auth) {
  }

  getMonth(month: string, userId?: string): Observable<Record<string, ActivityEntry>> {
    const coll = collection(this.db, 'users/' + (userId || this.auth.currentUser?.uid) + '/activity') as CollectionReference<ActivityEntry>;
    const nextMonth = format(addMonths(parse(month, 'yyyy-MM', new Date()), 1), 'yyyy-MM');

    return collectionData(
      query(coll, where(documentId(), '>=', month), where(documentId(), '<', nextMonth)),
      { idField: 'id', }
    )
      .pipe(map(activity => {
        return activity.reduce<Record<string, ActivityEntry>>((r, c) => {
          r[c.id] = c;

          return r;
        }, {});
      }));
  }

  async updateActivity(day: string, objectiveId: string, value: string | undefined) {
    const ref = doc(this.db, 'users/' + this.auth.currentUser?.uid + '/activity/' + day);

    const activityExists = (await getDoc(ref)).exists();

    if (!activityExists) {
      await setDoc(ref, { [objectiveId]: value });

      return;
    }

    await updateDoc(ref, objectiveId, value || deleteField());
  }
}
