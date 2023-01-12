import { Timestamp } from '@angular/fire/firestore';

export interface Group {
  id: string;
  creationDate: Timestamp;
  displayName: string;
  photoURL: string;
  description: string;
  members: string[];
  admins: [];
}
