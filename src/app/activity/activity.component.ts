import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, CollectionReference, deleteField, doc, docData, DocumentReference, Firestore, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { getDaysInMonth, getYear, isMonday, parse } from 'date-fns';
import { combineLatest, first, firstValueFrom, forkJoin, lastValueFrom, map, Observable, Subject, switchMap } from 'rxjs';
import { Objective } from '../models/Objective';
import { ActivityEntry, ObjectiveConfig } from '../models/User';
import { ObjectivesService } from '../services/db/objectives.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  @Input() userId?: string;

  readonly year;
  readonly months;

  objectiveConfigs: ObjectiveConfig[] = [];
  objectives: Objective[] | null = null;
  activity$: Observable<Record<string, ActivityEntry>> = new Subject();

  constructor(private db: Firestore, public auth: Auth, private objectivesService: ObjectivesService) {
    this.year = getYear(new Date());

    this.months = new Array(12).fill(0).map((_, i) => {
      return this.year + '-' + String(i + 1).padStart(2, '0');
    });
  }

  ngOnInit(): void {
    firstValueFrom(collectionData(collection(this.db, 'users/' + (this.userId || this.auth.currentUser?.uid) + '/objectives') as CollectionReference<ObjectiveConfig>, {
      idField: 'id',
    })).then(async configs => {
      this.objectives = await Promise.all(
        configs.map(c => firstValueFrom(this.objectivesService.get(c.id)))
      );
      this.objectiveConfigs = configs;
    });

    this.activity$ = collectionData(collection(this.db, 'users/' + (this.userId || this.auth.currentUser?.uid) + '/activity-' + this.year) as CollectionReference<ActivityEntry>, {
      idField: 'id',
    })
      .pipe(map(activity => {
        return activity.reduce<Record<string, ActivityEntry>>((r, c) => {
          r[c.id] = c;

          return r;
        }, {});
      }));
  }

  async setActivity(value: string, day: string, activity: string, activityExists: boolean) {
    const ref = doc(this.db, 'users/' + this.auth.currentUser?.uid + '/activity-' + this.year + '/' + day);

    if (!activityExists) {
      await setDoc(ref, { [activity]: value });

      return;
    }

    await updateDoc(ref, activity, value || deleteField());
  }

  daysOf(month: string): string[] {
    return new Array(getDaysInMonth(parse(month, 'yyyy-MM', 0))).fill(0).map((_, i) => {
      return month + '-' + String(i + 1).padStart(2, '0');
    });
  }

  isMonday(day: string): any {
    return isMonday(parse(day, 'yyyy-MM-dd', 0));
  }
}
