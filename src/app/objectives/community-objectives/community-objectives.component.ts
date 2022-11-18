import { Component, OnInit } from '@angular/core';
import { Database, listVal, orderByChild, query, ref } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Objective } from 'src/app/models/Objective';

@Component({
  selector: 'app-community-objectives',
  templateUrl: './community-objectives.component.html',
  styleUrls: ['./community-objectives.component.scss']
})
export class CommunityObjectivesComponent implements OnInit {
  objectives$: Observable<Objective[] | null>;

  constructor(private db: Database) {
    this.objectives$ = listVal<Objective>(query(
      ref(this.db, 'objectives'),
      orderByChild('name')
    ), {
      keyField: 'id',
    });
  }

  ngOnInit(): void {
  }

}
