import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getYear } from 'date-fns';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  @Input() userId?: string;

  months!: string[];
  year!: number;

  constructor(public auth: Auth) {
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
