import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Objective } from 'src/app/models/Objective';

@Component({
  selector: 'app-objective-form',
  templateUrl: './objective-form.component.html',
  styleUrls: ['./objective-form.component.scss']
})
export class ObjectiveFormComponent implements OnInit {

  form: FormGroup;

  constructor(public dialogueRef: MatDialogRef<ObjectiveFormComponent, Objective>) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      success: new FormControl('🟩', [Validators.required]),
      average: new FormControl('🟧', [Validators.required]),
      failure: new FormControl('🟥', [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

  submit() {
    this.dialogueRef.close(this.form.value);
  }

}
