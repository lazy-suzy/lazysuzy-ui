import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FormService {

  private stepOneSource: Subject<FormGroup> = new Subject();
  stepOne: Observable<FormGroup> = this.stepOneSource.asObservable();

  private stepTwoSource: Subject<FormGroup> = new Subject();
  stepTwo: Observable<FormGroup> = this.stepTwoSource.asObservable();

  mainForm: FormGroup = this._formBuilder.group({
    imageUrl: '',
    productTitle: '',
    price: '',
    productListingUrl: '',
    additionalTags: '',
    keepPrivate: ''
  });

  constructor(
    private _formBuilder: FormBuilder
  ) {
    this.stepOne.subscribe(form =>
      form.valueChanges.subscribe(val => {
        this.mainForm.value.imageUrl = val.imageUrl
      })
    )
    this.stepTwo.subscribe(form =>
      form.valueChanges.subscribe(val => {
        this.mainForm.value.productTitle = val.productTitle;
        this.mainForm.value.price = val.price;
        this.mainForm.value.productListingUrl = val.productListingUrl;
        this.mainForm.value.additionalTags = val.additionalTags;
        this.mainForm.value.keepPrivate = val.keepPrivate;
      })
    )
  }

  getAddViaUrlValues() {
    return this.mainForm.value;
  }

  stepReady(form: FormGroup, part) {
    switch (part) {
      case 'one': { this.stepOneSource.next(form) }
      case 'two': { this.stepTwoSource.next(form) }
    }
  }
}
