import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Objective } from 'src/app/models/Objective';
import { Db } from './abstract';

@Injectable({
  providedIn: 'root'
})
export class ObjectivesService extends Db<Objective> {

  constructor(db: Firestore) {
    super(db, 'objectives');
  }

  // can cleaned when db is updated
  protected override transform(dbData: any): Objective {
    return {
      triumph: '⭐',
      ...dbData,
    };
  }

}
