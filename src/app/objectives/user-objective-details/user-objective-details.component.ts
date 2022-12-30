import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Objective } from 'src/app/models/Objective';
import { ObjectiveConfig } from 'src/app/models/User';

@Component({
  selector: 'app-user-objective-details',
  templateUrl: './user-objective-details.component.html',
  styleUrls: ['./user-objective-details.component.scss']
})
export class UserObjectiveDetailsComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { objective: Objective, objectiveConfig: ObjectiveConfig },
  ) { }


  labelAverage(arg0: number) {
    throw new Error('Method not implemented.');
  }
}
