import { Component, Input, OnInit } from '@angular/core';
import { Objective } from 'src/app/models/Objective';

@Component({
  selector: 'app-objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss']
})
export class ObjectiveComponent implements OnInit {

  @Input() objective: Objective | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
