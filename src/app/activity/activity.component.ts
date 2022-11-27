import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { getYear } from 'date-fns';
import { ObjectivesService } from '../services/db/objectives.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  @Input() userId?: string;

  readonly months;

  constructor(private db: Firestore, public auth: Auth, private objectivesService: ObjectivesService) {
    const year = String(getYear(new Date()));

    this.months = new Array(12).fill(0).map((_, i) => {
      return year + '-' + String(i + 1).padStart(2, '0');
    });
  }

  ngOnInit(): void {
  }
}
