import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom, Observable } from 'rxjs';
import { User } from '../models/User';
import { UsersService } from '../services/db/users.service';
import { ImageResizerComponent } from './image-resizer/image-resizer.component';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  user$: Observable<User>;

  constructor(public auth: Auth, private db: Firestore, private usersService: UsersService, private snackBar: MatSnackBar, private dialog: MatDialog, private storage: Storage) {
    this.user$ = this.usersService.get(auth.currentUser?.uid as string);
  }

  ngOnInit(): void {
  }

  async updateDisplayName(displayName: string) {
    await updateDoc(doc(this.db, 'users/' + this.auth.currentUser?.uid), 'displayName', displayName);

    this.snackBar.open('Changements sauvegardés 👍');
  }

  async fileChangeEvent(fileEvent: Event) {
    const dialog = await this.dialog.open(ImageResizerComponent, {
      data: {
        fileEvent,
      }
    })

    const image: string = await lastValueFrom(dialog.afterClosed());

    if (image) {
      const imageName = Math.random().toString(36).replace('0.','') + '.png';
      const imageRef = ref(this.storage, imageName);

      await uploadString(imageRef, image, 'data_url');

      const url = await getDownloadURL(imageRef);

      await updateDoc(doc(this.db, 'users/' + this.auth.currentUser?.uid), 'photoURL', url);

      console.log('added image', image);

      this.snackBar.open('Image sauvegardée 😁');
    }
  }

}
