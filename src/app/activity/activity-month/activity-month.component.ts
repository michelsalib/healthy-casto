import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDays, format, getDaysInMonth, isBefore, isEqual, isMonday, isThisMonth, isToday, parse } from 'date-fns';
import { Observable, Subject, combineLatest, map, of, switchMap } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { DayString, ObjectiveConfig, User, YearActivity } from 'src/app/models/User';
import { ActivityService } from 'src/app/services/db/activity.service';
import { ObjectiveConfigService } from 'src/app/services/db/objectiveConfig.service';
import { ObjectivesService } from 'src/app/services/db/objectives.service';
import { computeMonthScore } from '../utils/computeScore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activity-month[months][user]',
  templateUrl: './activity-month.component.html',
  styleUrls: ['./activity-month.component.scss']
})
export class ActivityMonthComponent implements OnInit, OnChanges {
  @Input() user!: User;
  @Input() months!: string[];
  @Input() title?: string;
  isMe = false;

  dataset$: Observable<{
    objectiveConfigs: ObjectiveConfig[];
    objectives: Objective[];
    days: Record<string, DayString[]>;
    activity: YearActivity;
  } | null> = new Subject();
  editedDays: string[] = [];
  dragData?: {
    value: string | undefined,
    objectiveId: string,
    from: string,
  };
  public showScrollButton = false;

  constructor(
    private activityService: ActivityService,
    private auth: Auth,
    private objectivesService: ObjectivesService,
    private objectiveConfigService: ObjectiveConfigService,
    private element: ElementRef,
    private snackBar: MatSnackBar) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['months']) {
      this.showScrollButton = this.months.some(m => isThisMonth(parse(m, 'yyyy-MM', 0)));

      const days = this.months.reduce((res, month) => {
        res[month] = new Array(getDaysInMonth(parse(month, 'yyyy-MM', 0))).fill(0).map((_, i) => {
          return month + '-' + String(i + 1).padStart(2, '0') as DayString;
        });

        return res;
      }, {} as Record<string, DayString[]>);


      this.dataset$ = this.objectiveConfigService.list(this.user.id)
        .pipe(
          switchMap(configs =>
            combineLatest([
              configs.length ? combineLatest(configs.map(c => this.objectivesService.get(c.id))) : of([]),
              of(configs),
              this.activityService.getYear(this.months[0].split('-')[0], this.user.id),
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
  }

  ngOnInit(): void {
    this.isMe = this.user.id == this.auth.currentUser?.uid;
  }

  scroll() {
    const scrollable = this.element.nativeElement as HTMLElement;
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

  computeScore(month: string, config: ObjectiveConfig, activity: YearActivity): {
    emoji: string,
    score: number,
  } {
    return computeMonthScore(month, config, activity);
  }

  async setActivity(value: string, day: DayString, objectiveId: string) {
    if (value == '⭐') {
      this.snackBar.open('Tu t\'es depassé•e 👏', undefined, { duration: 3000, verticalPosition: 'top' });
    }

    await this.activityService.updateActivity(day, objectiveId, value);
  }

  getIcon(objective: Objective, value: string | undefined): string {
    switch (value) {
      case '⭐':
        return objective.triumph;
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
