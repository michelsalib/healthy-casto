import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, deleteField, doc, docData, Firestore, getDoc, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { documentId, DocumentReference } from '@firebase/firestore';
import { addYears, format, parse } from 'date-fns';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { ActivityEntry, DayString, YearActivity } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private db: Firestore, private auth: Auth) {
  }

  getYear(year: string, userId: string): Observable<YearActivity> {
    const ref: DocumentReference<YearActivity> = doc(this.db, 'users/' + userId + '/activity/' + year);

    return docData(ref)
      .pipe(
        switchMap(d => {
          if (d) {
            return of(d);
          }

          // gold old data format
          return this.getOldDataFormat(year, userId)
            // store in new format for next time
            .pipe(tap(data => {
              if (userId == this.auth.currentUser?.uid) {
                setDoc(ref, data, {
                  merge: true
                });
              }
            }));
        }),
      );
  }

  async updateActivity(day: DayString, objectiveId: string, value: string | undefined) {
    const ref: DocumentReference<YearActivity> = doc(this.db, 'users/' + this.auth.currentUser?.uid + '/activity/' + day.split('-')[0]);

    const activityExists = (await getDoc(ref)).exists();

    if (!activityExists) {
      await setDoc(ref, {
        [day]: {
          [objectiveId]: value
        }
      }, {
        merge: true,
      });

      return;
    }

    await updateDoc(ref, `${day}.${objectiveId}`, value || deleteField());
  }

  private getOldDataFormat(year: string, userId: string): Observable<YearActivity> {
    const coll = collection(this.db, 'users/' + userId + '/activity') as CollectionReference<ActivityEntry & { id: DayString }>;
    const nextYear = format(addYears(parse(year, 'yyyy', new Date()), 1), 'yyyy');

    return collectionData(
      query(coll, where(documentId(), '>=', year), where(documentId(), '<', nextYear)),
      { idField: 'id', }
    )
      .pipe(map(activity => {
        return activity.reduce<YearActivity>((r, c) => {
          r[c.id] = c;

          delete (c as any).id;

          return r;
        }, {});
      }));
  }
}
