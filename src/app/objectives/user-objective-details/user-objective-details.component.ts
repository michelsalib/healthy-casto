import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Objective } from 'src/app/models/Objective';
import { ObjectiveConfig, User } from 'src/app/models/User';

export interface UserObjectiveDetailsModel {
  objective: Objective;
  objectiveConfig: ObjectiveConfig;
  user: User;
}

@Component({
  selector: 'app-user-objective-details',
  templateUrl: './user-objective-details.component.html',
  styleUrls: ['./user-objective-details.component.scss']
})
export class UserObjectiveDetailsComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: UserObjectiveDetailsModel,
    private bottomSheetRef: MatBottomSheetRef<UserObjectiveDetailsComponent>
  ) { }

  close() {
    this.bottomSheetRef.dismiss();
  }
}
