import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-resizer',
  templateUrl: './image-resizer.component.html',
  styleUrls: ['./image-resizer.component.scss']
})
export class ImageResizerComponent implements OnInit {
  imageChangedEvent: Event;
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;

  constructor(private snack: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: { fileEvent: Event }, public dialogueRef: MatDialogRef<ImageResizerComponent, string>) {
    this.imageChangedEvent = data.fileEvent;
  }

  ngOnInit(): void {
  }

  loadImageFailed() {
    this.snack.open('Ton image n\'a pas pu être chargée.', undefined, { duration: 3000, verticalPosition: 'top' });
    this.dialogueRef.close();
  }

  submit() {
    this.dialogueRef.close(this.imageCropper.crop()?.base64 || undefined);
  }

}
