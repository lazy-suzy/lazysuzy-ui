import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../form.service'

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css']
})
export class StepTwoComponent implements OnInit {

  step: FormGroup;

  @Output() stepperUpdates: EventEmitter<any> = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder,
    private formService: FormService
  ) {
    this.step = this._formBuilder.group({
      productTitle: ['', Validators.required],
      price: ['', Validators.required],
      productListingUrl: [''],
      additionalTags: [''],
      keepPrivate: [false],
    });
    this.formService.stepReady(this.step, 'two');
  }

  ngOnInit() { }

  cancelAddImgViaUrl() {
    const payload = {
      name: 'cancel',
      data: {}
    };
    this.stepperUpdates.emit(payload);
  }

  saveAddViaUrl() {
    const data = this.formService.getAddViaUrlValues();
    const payload = {
      name: 'add-image-via-url',
      data: data
    };
    this.stepperUpdates.emit(payload);
  }

}
