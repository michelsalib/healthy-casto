import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import GraphemeSplitter from 'grapheme-splitter';
import { Objective } from 'src/app/models/Objective';

@Component({
  selector: 'app-objective-form',
  templateUrl: './objective-form.component.html',
  styleUrls: ['./objective-form.component.scss']
})
export class ObjectiveFormComponent implements OnInit {

  form: FormGroup<{
    name: FormControl<string>;
    description: FormControl<string>;
    success: FormControl<string>;
    average: FormControl<string>;
    failure: FormControl<string>;
  }>;

  constructor(public dialogueRef: MatDialogRef<ObjectiveFormComponent, Partial<Objective>>) {
    this.form = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      success: new FormControl('🟩', { nonNullable: true, validators: [Validators.required, singleCharacterValidator] }),
      average: new FormControl('🟧', { nonNullable: true, validators: [Validators.required, singleCharacterValidator] }),
      failure: new FormControl('🟥', { nonNullable: true, validators: [Validators.required, singleCharacterValidator] }),
    });
  }

  ngOnInit(): void {
  }

  submit() {
    this.dialogueRef.close(this.form.value);
  }

}

const SPLITTER = new GraphemeSplitter();

const singleCharacterValidator: ValidatorFn = function(control: AbstractControl<string>): ValidationErrors | null {
  if (SPLITTER.countGraphemes(control.value || '') != 1) {
    return {
      singleCharacter: control.value,
    };
  }

  return null;
};
