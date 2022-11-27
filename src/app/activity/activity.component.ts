import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { getYear } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { Objective } from '../models/Objective';
import { ActivityEntry, ObjectiveConfig } from '../models/User';
import { ObjectivesService } from '../services/db/objectives.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  @Input() userId?: string;

  readonly year;
  readonly months;

  constructor(private db: Firestore, public auth: Auth, private objectivesService: ObjectivesService) {
    this.year = String(getYear(new Date()));

    this.months = new Array(12).fill(0).map((_, i) => {
      return this.year + '-' + String(i + 1).padStart(2, '0');
    });
  }

  ngOnInit(): void {
  }
}
