import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { deleteField, doc, docData, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { DocumentReference } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { DayString, YearActivity } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private db: Firestore, private auth: Auth) {
  }

  getYear(year: string, userId: string): Observable<YearActivity> {
    const ref: DocumentReference<YearActivity> = doc(this.db, 'users/' + userId + '/activity/' + year);

    return docData(ref);
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
}
