import { Component, Input, OnInit } from '@angular/core';
import { getYear } from 'date-fns';
import { User } from '../models/User';

@Component({
  selector: 'app-activity[user]',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  @Input() user!: User;

  months!: string[];
  year!: number;

  constructor() {
    this.year = getYear(new Date());
    this.computeMonth(this.year);
  }

  computeMonth(year: number) {
    this.months = new Array(12).fill(0).map((_, i) => {
      return year + '-' + String(i + 1).padStart(2, '0');
    });
  }
}
