import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Asset } from '../../../asset';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-upload-file-details',
  templateUrl: './upload-file-details.component.html',
  styleUrls: ['./upload-file-details.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UploadFileDetailsComponent implements OnInit {
  showLoader = false;
  loaderTypeProgress = true;
  step: FormGroup;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  tags = [];

  constructor(
    public dialogRef: MatDialogRef<UploadFileDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) {
    this.step = this._formBuilder.group({
      productTitle: [''],
      price: [''],
      productListingUrl: [''],
      tags: "",
      keepPrivate: [false]
    });
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(data): void {
    this.dialogRef.close(data);
  }

  cancelAddImgViaUrl() {
    const payload = {
      name: 'cancel-save-image-details',
      data: {}
    };
  }

  saveAddViaUrl() {
    const payload = {
      name: 'save-image-details',
      data: new Asset({
        is_private: this.step.value.keepPrivate == true ? 1 : 0,
        name: this.step.value.productTitle,
        price: this.step.value.price,
        listing_url: this.step.value.productListingUrl,
        tags: this.tags.join(',')
      })
    };
    // if (this.step.value) {
    //   payload.data = this.step.value;
    // }
    this.onYesClick(payload);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

}
