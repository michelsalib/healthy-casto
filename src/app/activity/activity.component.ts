import { Component, Input, OnInit } from '@angular/core';
import { getYear } from 'date-fns';
import { User } from '../models/User';

@Component({
  selector: 'app-activity[user]',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  @Input() user!: User;

  months!: string[];
  year!: number;

  constructor() {
    this.setYear(getYear(new Date()));
  }

  ngOnInit(): void {
  }

  setYear(year: number): void {
    this.year = year;

    this.months = new Array(12).fill(0).map((_, i) => {
      return year + '-' + String(i + 1).padStart(2, '0');
    });
  }
}
