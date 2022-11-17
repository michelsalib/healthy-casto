import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Database, DatabaseReference, objectVal, ref, remove, set, update } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, switchMap, take } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { ObjectiveConfig } from 'src/app/models/User';

@Component({
  selector: 'app-objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss']
})
export class ObjectiveComponent implements OnInit {

  @Input() objective?: Objective;

  objectiveConfig$: Observable<ObjectiveConfig> = new Subject();
  ref?: DatabaseReference;

  constructor(public db: Database, public auth: Auth, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (!this.objective) {
      return;
    }

    this.ref = ref(this.db, 'users/' + this.auth.currentUser?.uid + '/objectives/' + this.objective.id);

    this.objectiveConfig$ = objectVal<ObjectiveConfig>(this.ref);
  }

  async unfollow() {
    if (!this.ref) {
      return;
    }

    await remove(this.ref);

    this.snackBar.open('Félicitation pour avoir tenu jusque là 🎉');
  }

  async follow() {
    if (!this.ref) {
      return;
    }

    await set(this.ref, { target: 15 });

    this.snackBar.open(`Tu suis maintenant l\'objectif ${this.objective?.name} ${this.objective?.success}`);
  }

}
