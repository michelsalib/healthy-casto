import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Database, listVal, objectVal, ref } from '@angular/fire/database';
import { combineLatest, Observable, Subject, switchMap } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { ObjectiveConfig } from 'src/app/models/User';

@Component({
  selector: 'app-user-objectives',
  templateUrl: './user-objectives.component.html',
  styleUrls: ['./user-objectives.component.scss']
})
export class UserObjectivesComponent implements OnInit {

  @Input() userId: string = '';
  objectives$: Observable<Objective[] | null> = new Subject();

  constructor(private db: Database, public auth: Auth) {
  }

  ngOnInit(): void {
    this.objectives$ = listVal<ObjectiveConfig>(ref(this.db, 'users/' + (this.userId || this.auth.currentUser?.uid) + '/objectives'))
      .pipe(
        switchMap(config => {
          if (!config) {
            config = [];
          }

          return combineLatest(config.map(config => {
            return objectVal<Objective>(ref(this.db, 'objectives/' + config.id), {
              keyField: 'id',
            });
          }));
        })
      );
  }

}
