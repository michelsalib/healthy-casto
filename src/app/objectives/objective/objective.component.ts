import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Database, DatabaseReference, objectVal, ref, remove, set } from '@angular/fire/database';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { ObjectiveConfig } from 'src/app/models/User';
import { LabelPipe } from '../label.pipe';

@Component({
  selector: 'app-objective[objective]',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss']
})
export class ObjectiveComponent implements OnInit {

  @Input() objective!: Objective;
  ref!: DatabaseReference;
  objectiveConfig$: Observable<ObjectiveConfig> = new Subject();

  constructor(public db: Database, public auth: Auth, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.ref = ref(this.db, `users/${this.auth.currentUser?.uid}/objectives/${this.objective.id}`);

    this.objectiveConfig$ = objectVal<ObjectiveConfig>(this.ref);
  }


  async toggle(event: MatSlideToggleChange) {
    if (!event.checked) {
      await remove(this.ref);

      this.snackBar.open('Félicitation pour avoir tenu jusque là 🎉');

      return;
    }

    await set(this.ref, { target: 15, averageValue: 0 });

    this.snackBar.open(`Tu suis maintenant l\'objectif ${this.objective.name} ${this.objective.success}`);
  }

  async setTarget($event: MatSliderChange) {
    await set(ref(this.db, `users/${this.auth.currentUser?.uid}/objectives/${this.objective.id}/target`), $event.value);
  }

  async setAverageValue(value: number) {
    await set(ref(this.db, `users/${this.auth.currentUser?.uid}/objectives/${this.objective.id}/averageValue`), value);
  }

  
  tooltip(value: number): string {
    return new LabelPipe().transform(value, 'short');
  }

}
