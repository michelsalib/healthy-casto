import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, Firestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { ObjectiveConfig } from 'src/app/models/User';

@Component({
  selector: 'app-user-objectives',
  templateUrl: './user-objectives.component.html',
  styleUrls: ['./user-objectives.component.scss']
})
export class UserObjectivesComponent implements OnInit {

  @Input() userId?: string;
  objectives$: Observable<ObjectiveConfig[] | null> = new Subject();

  constructor(private db: Firestore, public auth: Auth) {
  }

  ngOnInit(): void {
    this.objectives$ = collectionData(collection(this.db, 'users/' + (this.userId || this.auth.currentUser?.uid) + '/objectives') as CollectionReference<ObjectiveConfig>, {
      idField: 'id',
    });
  }

}
