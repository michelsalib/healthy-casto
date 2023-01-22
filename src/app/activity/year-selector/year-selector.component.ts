import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-year-selector[year]',
  templateUrl: './year-selector.component.html',
  styleUrls: ['./year-selector.component.scss']
})
export class YearSelectorComponent {
  @Input() year!: number;
  @Output() yearChange = new EventEmitter<number>();

  setYear(year: number) {
    this.year = year;
    this.yearChange.emit(this.year);
  }
}
