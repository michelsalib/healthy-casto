import { Component, Input, OnInit } from '@angular/core';
import { Database, objectVal, ref } from '@angular/fire/database';
import { collection, Firestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { ObjectiveConfig } from 'src/app/models/User';
import { ObjectivesService } from 'src/app/services/db/objectives.service';

@Component({
  selector: 'app-user-objective[objectiveConfig]',
  templateUrl: './user-objective.component.html',
  styleUrls: ['./user-objective.component.scss']
})
export class UserObjectiveComponent implements OnInit {

  @Input() objectiveConfig!: ObjectiveConfig;

  objective$: Observable<Objective> = new Subject();

  constructor(private db: ObjectivesService) {
  }

  ngOnInit(): void {
    this.objective$ = this.db.get(this.objectiveConfig.id);
  }

}
