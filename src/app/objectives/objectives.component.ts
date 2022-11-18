import { Component, OnInit } from '@angular/core';
import { Database, push, ref } from '@angular/fire/database';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Objective } from '../models/Objective';
import { ObjectiveFormComponent } from './objective-form/objective-form.component';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit {

  constructor(public dialog: MatDialog, public db: Database) { }

  ngOnInit(): void {
  }

  async create() {
    const dialog = await this.dialog.open(ObjectiveFormComponent)

    const objective: Objective = await lastValueFrom(dialog.afterClosed());

    await push(ref(this.db, 'objectives'), objective);
  }

}
