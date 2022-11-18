import { Component, Input, OnInit } from '@angular/core';
import { Database, objectVal, ref } from '@angular/fire/database';
import { Observable, Subject } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { ObjectiveConfig } from 'src/app/models/User';

@Component({
  selector: 'app-user-objective[objectiveConfig]',
  templateUrl: './user-objective.component.html',
  styleUrls: ['./user-objective.component.scss']
})
export class UserObjectiveComponent implements OnInit {

  @Input() objectiveConfig!: ObjectiveConfig;

  objective$: Observable<Objective> = new Subject();

  constructor(private db: Database) {
  }

  ngOnInit(): void {
    this.objective$ = objectVal<Objective>(ref(this.db, 'objectives/' + this.objectiveConfig.id), {
      keyField: 'id',
    });
  }

}
