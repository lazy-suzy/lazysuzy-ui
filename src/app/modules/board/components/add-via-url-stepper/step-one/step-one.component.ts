import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../form.service'

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css']
})
export class StepOneComponent {

  step: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private formService: FormService
  ) {
    this.step = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      extraName: ''
    });
    this.formService.stepReady(this.step, 'one')
  }

  change(title){
    this.step.patchValue({ extraName: title})
  }

}