import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { Objective } from '../models/Objective';
import { ObjectivesService } from '../services/db/objectives.service';
import { ObjectiveFormComponent } from './objective-form/objective-form.component';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit {

  constructor(public dialog: MatDialog, public objectivesDb: ObjectivesService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  async create() {
    const dialog = await this.dialog.open(ObjectiveFormComponent)

    const objective: Objective = await lastValueFrom(dialog.afterClosed());

    if (objective) {
      await this.objectivesDb.add(objective);
  
      this.snackBar.open('Objectif créée 🫡', undefined, { duration: 3000, verticalPosition: 'top' });
    }
  }

}
