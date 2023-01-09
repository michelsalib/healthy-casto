import { Timestamp } from '@angular/fire/firestore';

export interface Group {
  id: string;
  creationDate: Timestamp;
  displayName: string;
  photoURL: string;
  members: string[];
  admins: [];
}
