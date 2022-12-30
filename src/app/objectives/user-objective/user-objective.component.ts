import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BehaviorSubject, Observable, pipe, Subject, tap } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { ObjectiveConfig, User } from 'src/app/models/User';
import { ObjectivesService } from 'src/app/services/db/objectives.service';
import { UserObjectiveDetailsComponent, UserObjectiveDetailsModel } from '../user-objective-details/user-objective-details.component';

@Component({
  selector: 'app-user-objective[objectiveConfig][user]',
  templateUrl: './user-objective.component.html',
  styleUrls: ['./user-objective.component.scss']
})
export class UserObjectiveComponent implements OnInit {

  @Input() user!: User;
  @Input() objectiveConfig!: ObjectiveConfig;
  @Input() objective!: Objective;

  objective$: Observable<Objective> = new Subject();

  constructor(private db: ObjectivesService, private bottomSheet: MatBottomSheet) {
  }

  ngOnInit(): void {
    if (this.objective) {
      this.objective$ = new BehaviorSubject(this.objective);
    }
    else {
      this.objective$ = this.db.get(this.objectiveConfig.id)
        .pipe(tap(o => this.objective = o));
    }
  }

  openDetails($event: MouseEvent) {
    $event.stopPropagation();

    this.bottomSheet.open<UserObjectiveDetailsComponent, UserObjectiveDetailsModel>(UserObjectiveDetailsComponent, {
      data: {
        objective: this.objective,
        objectiveConfig: this.objectiveConfig,
        user: this.user,
      },
    });
  }

}
