import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { chain, keyBy, zipObject } from 'lodash';
import { combineLatest, map, Observable, Subject } from 'rxjs';
import { computeGroupScore, computeMonthScore } from 'src/app/activity/utils/computeScore';
import { Objective } from 'src/app/models/Objective';
import { ObjectiveConfig, User, YearActivity } from 'src/app/models/User';
import { ActivityService } from 'src/app/services/db/activity.service';
import { ObjectiveConfigService } from 'src/app/services/db/objectiveConfig.service';
import { ObjectivesService } from 'src/app/services/db/objectives.service';

interface GroupActivityModel {
  activity: Record<string, YearActivity>;
  objectives: Record<string, Objective>;
  objectiveConfigs: Record<string, ObjectiveConfig[]>;
}

@Component({
  selector: 'app-group-activity[users][year]',
  templateUrl: './group-activity.component.html',
  styleUrls: ['./group-activity.component.scss']
})
export class GroupActivityComponent implements OnChanges {
  @Input() users!: User[] | null;
  @Input() year!: number;

  months!: string[];

  dataset$: Observable<GroupActivityModel | null> = new Subject();

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
        // followed objectives
        const followedObjectives = chain(objectiveConfigs).flattenDeep().map(o => o.id).uniq().value();

        return {
          objectives: chain(objectives).filter(o => followedObjectives.includes(o.id)).keyBy('id').value(),
          activity: zipObject(userIds, acvtivities),
          objectiveConfigs: zipObject(userIds, objectiveConfigs),
        }
      }));
    }
  }

  computeScore(month: string, config: ObjectiveConfig, activity: YearActivity) {
    return computeMonthScore(month, config, activity);
  }

  computeGroupScore(month: string, objective: Objective, dataset: GroupActivityModel) {
    if (!this.users?.length) {
      return null;
    }

    const participatingUsers = this.users.filter(u => dataset.objectiveConfigs[u.id].find(c => c.id == objective.id));

    return computeGroupScore(month, participatingUsers.map(u => {
      return {
        activity: dataset.activity[u.id],
        config: dataset.objectiveConfigs[u.id].find(o => o.id == objective.id) as ObjectiveConfig,
      };
    }));
  }

  computeYearTotal(objective: Objective, dataset: GroupActivityModel): number {
    if (!this.users?.length) {
      return NaN;
    }

    return this.users
      .filter(u => dataset.objectiveConfigs[u.id].find(c => c.id == objective.id))
      .reduce((total, u) => {
        const config = dataset.objectiveConfigs[u.id].find(o => o.id == objective.id) as ObjectiveConfig;

        const userScore = Object.values(dataset.activity[u.id]).reduce((r, entry) => {
          const act = entry?.[objective.id];
            if (act == '🟩') {
                return ++r;
            }

            if (act == '🟧') {
                return r + config.averageValue;
            }

            return r;
        }, 0);

        return total + userScore;
      }, 0);
  }
}
