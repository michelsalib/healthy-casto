import { Timestamp } from '@angular/fire/firestore';

export interface User {
  id: string;
  creationDate: Timestamp;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface ObjectiveConfig {
  id: string;
  target: number;
  averageValue: number;
}

export interface ActivityEntry {
  id: string; // the day of activity
  [objectiveId: string]: string;
}
