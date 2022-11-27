import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, Firestore } from '@angular/fire/firestore';
import { getDaysInMonth, isMonday, parse } from 'date-fns';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { ActivityEntry, ObjectiveConfig } from 'src/app/models/User';
import { ActivityService } from 'src/app/services/db/activity.service';
import { ObjectivesService } from 'src/app/services/db/objectives.service';

@Component({
  selector: 'app-activity-month[month]',
  templateUrl: './activity-month.component.html',
  styleUrls: ['./activity-month.component.scss']
})
export class ActivityMonthComponent implements OnInit {
  @Input() userId?: string;
  @Input() month!: string;

  objectiveConfigs: ObjectiveConfig[] = [];
  objectives: Objective[] | null = null;
  activity$: Observable<Record<string, ActivityEntry>> = new Subject();

  days!: string[];

  constructor(private activityService: ActivityService, private db: Firestore, private auth: Auth, private objectivesService: ObjectivesService) {

  }

  ngOnInit(): void {
    this.days = new Array(getDaysInMonth(parse(this.month, 'yyyy-MM', 0))).fill(0).map((_, i) => {
      return this.month + '-' + String(i + 1).padStart(2, '0');
    });

    firstValueFrom(collectionData(collection(this.db, 'users/' + (this.userId || this.auth.currentUser?.uid) + '/objectives') as CollectionReference<ObjectiveConfig>, {
      idField: 'id',
    })).then(async configs => {
      this.objectives = await Promise.all(
        configs.map(c => firstValueFrom(this.objectivesService.get(c.id)))
      );
      this.objectiveConfigs = configs;
    });

    this.activity$ = this.activityService.getMonth(this.month, this.userId);
  }

  isMonday(day: string): any {
    return isMonday(parse(day, 'yyyy-MM-dd', 0));
  }

  computeActivity(month: string, config: ObjectiveConfig, activity: Record<string, ActivityEntry>): number {
    return Object.keys(activity).filter(day => day.startsWith(month) && activity[day][config.id]).reduce((r, c) => {
      const act = activity[c][config.id];

      if (act == '🟩') {
        return ++r;
      }

      if (act == '🟧') {
        return r + config.averageValue;
      }

      return r;
    }, 0);
  }

  async setActivity(value: string, day: string, activity: string) {
    this.activityService.updateActivity(day, activity, value);
  }

  getIcon(objective: Objective, value: string | undefined): string {
    switch (value) {
      case '🟩':
        return objective.success;
      case '🟧':
        return objective.average;
      case '🟥':
        return objective.failure;
    }

    return ' ';
  }

}
