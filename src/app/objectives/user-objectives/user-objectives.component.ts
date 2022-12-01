import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, Firestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { ObjectiveConfig } from 'src/app/models/User';
import { ObjectiveConfigService } from 'src/app/services/db/objectiveConfig.service';

@Component({
  selector: 'app-user-objectives',
  templateUrl: './user-objectives.component.html',
  styleUrls: ['./user-objectives.component.scss']
})
export class UserObjectivesComponent implements OnInit {

  @Input() userId?: string;
  objectives$: Observable<ObjectiveConfig[] | null> = new Subject();

  constructor(private db: Firestore, public auth: Auth, private objectiveConfigService: ObjectiveConfigService) {
  }

  ngOnInit(): void {
    this.objectives$ = this.objectiveConfigService.list(this.userId);
  }

}
