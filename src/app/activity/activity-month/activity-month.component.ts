import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, Firestore } from '@angular/fire/firestore';
import { addDays, format, getDaysInMonth, isAfter, isBefore, isEqual, isMonday, parse } from 'date-fns';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { ActivityEntry, ObjectiveConfig } from 'src/app/models/User';
import { ActivityService } from 'src/app/services/db/activity.service';
import { ObjectiveConfigService } from 'src/app/services/db/objectiveConfig.service';
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
  editedDays: string[] = [];
  dragData?: {
    value: string | undefined,
    objectiveId: string,
    from: string,
  };

  constructor(private activityService: ActivityService, private db: Firestore, private auth: Auth, private objectivesService: ObjectivesService, private objectiveConfigService: ObjectiveConfigService) {

  }

  ngOnInit(): void {
    this.days = new Array(getDaysInMonth(parse(this.month, 'yyyy-MM', 0))).fill(0).map((_, i) => {
      return this.month + '-' + String(i + 1).padStart(2, '0');
    });

    firstValueFrom(this.objectiveConfigService.list(this.userId)).then(async configs => {
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

  computeScore(month: string, config: ObjectiveConfig, activity: Record<string, ActivityEntry>): {
    emoji: string,
    score: number,
  } {
    const activeDays = Object.keys(activity).filter(day => day.startsWith(month) && activity[day][config.id]);

    const score = activeDays
      .reduce((r, c) => {
        const act = activity[c][config.id];

        if (act == '🟩') {
          return ++r;
        }

        if (act == '🟧') {
          return r + config.averageValue;
        }

        return r;
      }, 0);

    const ratio = score * this.days.length / activeDays.length / Math.min(config.target, this.days.length);

    let emoji = '😶';
    if (ratio < 0.8) {
      emoji = '😩';
    }
    else if (ratio < 1) {
      emoji = '😟';
    }
    else if (ratio < 1.1) {
      emoji = '🙂';
    }
    else if (ratio < 1.2) {
      emoji = '😀';
    }
    else if (ratio >= 1.2) {
      emoji = '🤩';
    }

    return {
      emoji,
      score,
    }
  }

  async setActivity(value: string, day: string, objectiveId: string) {
    await this.activityService.updateActivity(day, objectiveId, value);
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

  dragStart($event: DragEvent, value: string | undefined, day: string, objectiveId: string) {
    if (!$event.dataTransfer) {
      return;
    }

    this.dragData = {
      from: day,
      objectiveId,
      value,
    };

    $event.dataTransfer.effectAllowed = 'copyMove';
    $event.dataTransfer.dropEffect = 'copy';
  }

  dragEnter($event: DragEvent, objectiveId: string, toDate: string) {
    if (!this.dragData || objectiveId != this.dragData.objectiveId) {
      return;
    }

    $event.preventDefault();

    this.editedDays = this.computeRange(this.dragData.from, toDate);
  }

  dragOver($event: DragEvent, objectiveId: string) {
    if (!this.dragData || objectiveId != this.dragData.objectiveId) {
      return;
    }

    $event.preventDefault();
  }

  async drop($event: DragEvent, objectiveId: string, toDate: string) {
    if (!this.dragData || objectiveId != this.dragData.objectiveId) {
      return;
    }

    const data = this.dragData;
    this.dragData = undefined;

    // compute range
    const days = this.computeRange(data.from, toDate);

    // apply changes
    await Promise.all(days.map(d => this.activityService.updateActivity(d, objectiveId, data.value)));
    this.editedDays = [];
  }

  private computeRange(fromDay: string, toDay: string): string[] {
    // compute range
    let from = parse(fromDay, 'yyyy-MM-dd', new Date());
    let to = parse(toDay, 'yyyy-MM-dd', new Date());
    if (isBefore(to, from)) {
      const temp = from;
      from = to;
      to = temp;
    }

    const days = [];
    while (isBefore(from, to) || isEqual(from, to)) {
      days.push(format(from, 'yyyy-MM-dd'));
      from = addDays(from, 1);
    }

    return days;
  }
}
