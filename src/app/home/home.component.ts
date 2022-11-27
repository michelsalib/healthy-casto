import { Component, OnInit } from '@angular/core';
import { getMonth, getYear } from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  readonly year;
  readonly months;

  constructor() {
    const currentMonth = getMonth(new Date());
    this.year = String(getYear(new Date()));
    this.months = [currentMonth, currentMonth + 1].map(m => this.year + '-' + String(m).padStart(2, '0'));
  }

  ngOnInit(): void {
  }

}
