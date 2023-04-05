import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { chain, keyBy, zipObject } from 'lodash';
import { combineLatest, map, Observable, Subject } from 'rxjs';
import { blankScore, computeGroupScore, computeMonthScore, Score } from 'src/app/activity/utils/computeScore';
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

  computeGroupScore(month: string, objective: Objective, dataset: GroupActivityModel): Score {
    const participatingUsers = this.getParticipatingUsersFrom(dataset, objective);

    if (!participatingUsers.length) {
      return blankScore();
    }

    return computeGroupScore(month, participatingUsers.map(u => {
      return {
        activity: dataset.activity[u.id],
        config: this.getPublicObjectiveConfigFrom(dataset, u, objective) as ObjectiveConfig,
      };
    }));
  }

  computeYearTotal(objective: Objective, dataset: GroupActivityModel): number {
    const participatingUsers = this.getParticipatingUsersFrom(dataset, objective);

    if (!participatingUsers.length) {
      return NaN;
    }

    return participatingUsers
      .reduce((total, u) => {
        const config = this.getPublicObjectiveConfigFrom(dataset, u, objective) as ObjectiveConfig;

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

  getParticipatingUsersFrom(dataset: GroupActivityModel, objective: Objective): User[] {
    if (!this.users?.length) {
      return [];
    }

    return this.users.filter(u => this.getPublicObjectiveConfigFrom(dataset, u, objective));
  }

  private getPublicObjectiveConfigFrom(dataset: GroupActivityModel, user: User, objective: Objective): ObjectiveConfig | undefined {
    const config = dataset.objectiveConfigs[user.id].find(c => c.id == objective.id);

    return config?.private ? undefined : config;
  }
}
