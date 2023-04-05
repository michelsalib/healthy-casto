import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { deleteDoc, doc, docData, DocumentReference, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable, Subject, switchMap } from 'rxjs';
import { Objective } from 'src/app/models/Objective';
import { ObjectiveConfig, User } from 'src/app/models/User';
import { FollowService } from 'src/app/services/db/follow.service';
import { ObjectiveConfigService } from 'src/app/services/db/objectiveConfig.service';
import { LabelPipe } from '../label.pipe';

@Component({
  selector: 'app-objective[objective]',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss']
})
export class ObjectiveComponent implements OnInit {

  @Input() objective!: Objective;
  ref!: DocumentReference<ObjectiveConfig>;
  objectiveConfig$: Observable<ObjectiveConfig> = new Subject();
  users$: Observable<Record<string, { user: User, config: ObjectiveConfig }[]>> = new Subject();

  constructor(private db: Firestore, private auth: Auth, private snackBar: MatSnackBar, private followService: FollowService, private objectiveConfigService: ObjectiveConfigService) {
  }

  ngOnInit(): void {
    this.ref = doc(this.db, `users/${this.auth.currentUser?.uid}/objectives/${this.objective.id}`) as DocumentReference<ObjectiveConfig>;

    this.objectiveConfig$ = docData<ObjectiveConfig>(this.ref);

    // this.users$ = this.followService.followings(this.auth.currentUser?.uid as string)
    //   .pipe(
    //     switchMap(async friends => {
    //       if (!friends) {
    //         return {};
    //       }

    //       const friendsObjectives = await Promise.all(friends?.map(async user => {
    //         const configs = await firstValueFrom(this.objectiveConfigService.list(user.id));

    //         return {
    //           user,
    //           configs,
    //         };
    //       }));

    //       const result: Record<string, { user: User, config: ObjectiveConfig }[]> = {};
    //       for (const { user, configs } of friendsObjectives) {
    //         for (const config of configs) {
    //           result[config.id] = result[config.id] || [];
    //           result[config.id].push({
    //             user,
    //             config,
    //           });
    //         }
    //       }

    //       return result;
    //     }));
  }

  async toggle(event: MatSlideToggleChange) {
    if (!event.checked) {
      await deleteDoc(this.ref);

      this.snackBar.open('Félicitation pour avoir tenu jusque là 🎉', undefined, { duration: 3000, verticalPosition: 'top' });

      return;
    }

    await setDoc(this.ref, { target: 15, averageValue: 0.5 } as ObjectiveConfig);

    this.snackBar.open(`Tu suis maintenant l\'objectif ${this.objective.name} ${this.objective.success}`, undefined, { duration: 3000, verticalPosition: 'top' });
  }

  async setTarget(target: string) {
    await updateDoc(this.ref, 'target', Number(target));
  }

  async setAverageValue(value: number) {
    await updateDoc(this.ref, 'averageValue', value);
  }

  tooltip(value: number): string {
    return new LabelPipe().transform(value, 'short');
  }

  async setPrivate(event: MatSlideToggleChange) {
    await updateDoc(this.ref, 'private', event.checked);
  }
}
