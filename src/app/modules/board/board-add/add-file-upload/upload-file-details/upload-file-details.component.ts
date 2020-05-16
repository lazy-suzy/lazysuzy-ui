import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

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

  constructor(
    public dialogRef: MatDialogRef<UploadFileDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) {
    this.step = this._formBuilder.group({
      productTitle: ['', Validators.required],
      price: ['', Validators.required],
      productListingUrl: ['', Validators.required],
      additionalTags: ['', Validators.required],
      keepPrivate: [false],
    });
  }

  ngOnInit(): void { }

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
    const data = {}
    const payload = {
      name: 'save-image-details',
      data: this.step.value
    };
    this.onYesClick(payload);
  }
}