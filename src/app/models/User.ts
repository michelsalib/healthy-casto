import { Timestamp } from '@angular/fire/firestore';

export interface User {
  id: string;
  creationDate: Timestamp;
  displayName: string;
  email: string;
  photoURL: string;
  follows: string[];
}

export interface ObjectiveConfig {
  id: string;
  target: number;
  averageValue: number;
}

export interface ActivityEntry {
  [objectiveId: string]: string;
}

export type YearActivity = {
  [day: DayString]: ActivityEntry | undefined;
};

export type DayString = `${number}-${number}-${number}`;
