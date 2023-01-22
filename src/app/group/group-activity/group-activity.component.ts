import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { keyBy, zipObject } from 'lodash';
import { combineLatest, map, Observable, Subject } from 'rxjs';
import { computeMonthScore } from 'src/app/activity/utils/computeScore';
import { Objective } from 'src/app/models/Objective';
import { ObjectiveConfig, User, YearActivity } from 'src/app/models/User';
import { ActivityService } from 'src/app/services/db/activity.service';
import { ObjectiveConfigService } from 'src/app/services/db/objectiveConfig.service';
import { ObjectivesService } from 'src/app/services/db/objectives.service';

@Component({
  selector: 'app-group-activity[users][year]',
  templateUrl: './group-activity.component.html',
  styleUrls: ['./group-activity.component.scss']
})
export class GroupActivityComponent implements OnChanges {
  @Input() users!: User[] | null;
  @Input() year!: number;
  
  months!: string[];

  dataset$: Observable<{
    activity: Record<string, YearActivity>;
    objectives: Record<string, Objective>;
    objectiveConfigs: Record<string, ObjectiveConfig[]>;
  } | null> = new Subject();

  constructor(private objectiveConfigService: ObjectiveConfigService, private objectiveService: ObjectivesService, private activityServie: ActivityService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.users) {
      this.months = new Array(12).fill(0).map((_, i) => {
        return this.year + '-' + String(i + 1).padStart(2, '0');
      });

      const userIds = this.users.map(u => u.id);

      this.dataset$ = combineLatest([
        combineLatest(userIds.map(u => this.activityServie.getYear(String(this.year), u))),
        combineLatest(userIds.map(u => this.objectiveConfigService.list(u))),
        this.objectiveService.list()
      ]).pipe(map(([acvtivities, objectiveConfigs, objectives]) => {
        return {
          objectives: keyBy(objectives, 'id'),
          activity: zipObject(userIds, acvtivities),
          objectiveConfigs: zipObject(userIds, objectiveConfigs),
        }
      }))
    }
  }

  computeScore(month: string, config: ObjectiveConfig, activity: YearActivity) {
    return computeMonthScore(month, config, activity);
  }
}
