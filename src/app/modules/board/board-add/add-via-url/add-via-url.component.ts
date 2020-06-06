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

@Component({
  selector: 'app-add-via-url',
  templateUrl: './add-via-url.component.html',
  styleUrls: ['./add-via-url.component.less'],
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
  isUrlAdded: boolean = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  tags = [];
  constructor(
    public dialogRef: MatDialogRef<AddViaUrlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private boardService: BoardService,
    public formService: FormService,
    private _formBuilder: FormBuilder
  ) {
    this.myForm = this.formService.mainForm.value;
    this.stepOne = this._formBuilder.group({
      imageUrl: ['', Validators.pattern(this.urlPattern)]
    });
    // this.formService.stepReady(this.stepOne, 'one');
    this.stepTwo = this._formBuilder.group({
      productTitle: [''],
      price: [''],
      productListingUrl: [''],
      tags: [''],
      keepPrivate: [false]
    });
    // this.formService.stepReady(this.stepTwo, 'two');
  }

  ngOnInit(): void {}

  get imageUrl() {
    this.isUrlAdded = this.stepOne.valid ? true : false;
    return this.stepOne.get('imageUrl');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(data): void {
    this.dialogRef.close(data);
  }

  cancelAddImgViaUrl() {
    this.dialogRef.close();
  }

  saveAddViaUrl() {
    this.showLoader = true;
    const data = {
      tags: this.tags.join(','),
      url: this.stepOne.value.imageUrl,
      is_private: this.stepTwo.value.keepPrivate == true ? 1 : 0,
      price: this.stepTwo.value.price,
      listing_url: this.stepTwo.value.productListingUrl,
      name: this.stepTwo.value.productTitle,
      brand: 'Custom'
    };
    let asset = new Asset(data);
    this.boardService.addAsset(asset).subscribe((res) => {
      this.showLoader = false;
      this.onYesClick(res);
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
