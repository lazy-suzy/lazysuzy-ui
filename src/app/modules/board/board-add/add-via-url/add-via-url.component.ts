import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { BoardService } from '../../board.service';
import { Asset } from '../../asset';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../form.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-add-via-url',
  templateUrl: './add-via-url.component.html',
  styleUrls: ['../../board.component.less', './add-via-url.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [FormService]
})
export class AddViaUrlComponent implements OnInit {
  showLoader = false;
  loaderTypeProgress = true;
  isLinear = false;
  myForm: Array<string>;
  urlPattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  stepOne: FormGroup;
  stepTwo: FormGroup;
  isUrlAdded = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  hasErrorMessage = false;
  tags = [];
  showImageVerificationLoader = false;
  constructor(
    public dialogRef: MatDialogRef<AddViaUrlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private boardService: BoardService,
    public formService: FormService,
    private formBuilder: FormBuilder
  ) {
    this.myForm = this.formService.mainForm.value;
    this.stepOne = this.formBuilder.group({
      imageUrl: ['', Validators.required]
    });
    this.stepTwo = this.formBuilder.group({
      productTitle: [''],
      brand: '',
      price: [''],
      productListingUrl: [''],
      tags: [''],
      keepPrivate: [false]
    });
  }
  ngOnInit() {}

  verifyImage(stepper: MatStepper) {
    this.showImageVerificationLoader = true;
    const img = new Image();
    img.src = this.stepOne.value.imageUrl;
    const self = this;
    img.onload = () => {
      self.hasErrorMessage = false;
      stepper.next();
    };
    img.onerror = () => {
      self.hasErrorMessage = true;
    };
    this.showImageVerificationLoader = false;
  }

  onNoClick(): void {
    this.stepTwo = this.formBuilder.group({
      productTitle: [''],
      brand: '',
      price: [''],
      productListingUrl: [''],
      tags: '',
      keepPrivate: [false]
    });
    this.dialogRef.close(false);
  }

  onYesClick(data): void {
    this.dialogRef.close(data);
  }

  cancelAddImgViaUrl() {
    this.stepTwo = this.formBuilder.group({
      productTitle: [''],
      brand: '',
      price: [''],
      productListingUrl: [''],
      tags: '',
      keepPrivate: [false]
    });
    this.dialogRef.close(false);
  }

  saveAddViaUrl() {
    this.showLoader = true;
    const data = {
      tags: this.tags.join(','),
      url: this.stepOne.value.imageUrl,
      is_private: this.stepTwo.value.keepPrivate === true ? 1 : 0,
      price: this.stepTwo.value.price,
      listing_url: this.stepTwo.value.productListingUrl,
      name: this.stepTwo.value.productTitle,
      brand: this.stepTwo.value.brand
    };
    const asset = new Asset(data);
    this.boardService.addAsset(asset).subscribe((res) => {
      this.showLoader = false;
      if (res) {
        this.onYesClick(res);
      } else {
        this.hasErrorMessage = true;
      }
    });
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
