import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDays, format, getDaysInMonth, isBefore, isEqual, isMonday, isThisMonth, isToday, parse } from 'date-fns';
import { combineLatest, map, Observable, of, Subject, switchMap } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { ActivityEntry, DayString, ObjectiveConfig, User } from 'src/app/models/User';
import { ActivityService } from 'src/app/services/db/activity.service';
import { ObjectiveConfigService } from 'src/app/services/db/objectiveConfig.service';
import { ObjectivesService } from 'src/app/services/db/objectives.service';

@Component({
  selector: 'app-activity-month[month][user]',
  templateUrl: './activity-month.component.html',
  styleUrls: ['./activity-month.component.scss']
})
export class ActivityMonthComponent implements OnInit {
  @Input() user!: User;
  @Input() month!: string;
  isMe = false;

  @ViewChild('daysContainer') daysContainer!: ElementRef;
  dataset$: Observable<{
    objectiveConfigs: ObjectiveConfig[];
    objectives: Objective[];
    days: DayString[];
    activity: Record<string, ActivityEntry | undefined>;
  } | null> = new Subject();
  editedDays: string[] = [];
  dragData?: {
    value: string | undefined,
    objectiveId: string,
    from: string,
  };
  public showScrollButton = false;

  constructor(private activityService: ActivityService, private auth: Auth, private objectivesService: ObjectivesService, private objectiveConfigService: ObjectiveConfigService) {

  }

  ngOnInit(): void {
    this.isMe = this.user.id == this.auth.currentUser?.uid;

    const month = parse(this.month, 'yyyy-MM', 0);

    this.showScrollButton = isThisMonth(month);

    const days = new Array(getDaysInMonth(month)).fill(0).map((_, i) => {
      return this.month + '-' + String(i + 1).padStart(2, '0') as DayString;
    });

    this.dataset$ = this.objectiveConfigService.list(this.user.id)
      .pipe(
        switchMap(configs =>
          combineLatest([
            combineLatest(configs.map(c => this.objectivesService.get(c.id))),
            of(configs),
            this.activityService.getMonth(this.month, this.user.id),
            of(days),
          ])
        ),
        map(([objectives, objectiveConfigs, activity, days]) => {
          return {
            objectives,
            objectiveConfigs,
            activity,
            days,
          };
        })
      );
  }

  scroll() {
    const scrollable = this.daysContainer?.nativeElement as HTMLDivElement;
    const todayDiv = scrollable.querySelector('.today');
    todayDiv?.scrollIntoView({
      block: 'center',
      inline: 'center',
      behavior: 'smooth',
    });
    this.showScrollButton = false;
  }

  isMonday(day: string): any {
    return isMonday(parse(day, 'yyyy-MM-dd', 0));
  }

  isToday(day: string): any {
    return isToday(parse(day, 'yyyy-MM-dd', 0));
  }

  computeScore(month: string, config: ObjectiveConfig, activity: Record<string, ActivityEntry | undefined>, days: number): {
    emoji: string,
    score: number,
  } {
    const activeDays = Object.keys(activity).filter(day => day.startsWith(month) && activity[day]?.[config.id]);

    const score = activeDays
      .reduce((r, c) => {
        const act = activity[c]?.[config.id];

        if (act == '🟩') {
          return ++r;
        }

        if (act == '🟧') {
          return r + config.averageValue;
        }

        return r;
      }, 0);

    const ratio = score * days / activeDays.length / Math.min(config.target, days);

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
    };
  }

  async setActivity(value: string, day: DayString, objectiveId: string) {
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

  private computeRange(fromDay: string, toDay: string): DayString[] {
    // compute range
    let from = parse(fromDay, 'yyyy-MM-dd', new Date());
    let to = parse(toDay, 'yyyy-MM-dd', new Date());
    if (isBefore(to, from)) {
      const temp = from;
      from = to;
      to = temp;
    }

    const days: DayString[] = [];
    while (isBefore(from, to) || isEqual(from, to)) {
      days.push(format(from, 'yyyy-MM-dd') as DayString);
      from = addDays(from, 1);
    }

    return days;
  }
}
