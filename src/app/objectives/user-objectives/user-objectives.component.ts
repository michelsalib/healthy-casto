import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Database, listVal, objectVal, ref } from '@angular/fire/database';
import { map, Observable, switchMap, take } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-user-objectives',
  templateUrl: './user-objectives.component.html',
  styleUrls: ['./user-objectives.component.scss']
})
export class UserObjectivesComponent implements OnInit {

  @Input() userId: string = '';
  user$: Observable<User>;
  objectives$: Observable<Objective[] | null>;

  constructor(private db: Database, public auth: Auth) {
    this.user$ = objectVal<User>(ref(this.db, 'users/' + (this.userId || auth.currentUser?.uid)), {
      keyField: 'id',
    });

    this.objectives$ = listVal<Objective>(ref(this.db, 'objectives'), {
      keyField: 'id',
    });
  }

  ngOnInit(): void {
  }

  findObjective(objectiveConfig: { id: string; }): Observable<Objective | undefined> {
    return 'todo' as any;
  }

}
