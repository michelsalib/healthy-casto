import { Component, OnInit } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { ObjectivesService } from 'src/app/services/db/objectives.service';

@Component({
  selector: 'app-community-objectives',
  templateUrl: './community-objectives.component.html',
  styleUrls: ['./community-objectives.component.scss']
})
export class CommunityObjectivesComponent implements OnInit {
  objectives$: Observable<Objective[] | null>;

  constructor(db: ObjectivesService) {
    this.objectives$ = db.list(orderBy('name'));
  }

  ngOnInit(): void {
  }

}
