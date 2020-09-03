import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Asset } from '../../../asset';
import { BoardService } from '../../../board.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { EventEmitterService } from '../../../../../shared/services';

@Component({
  selector: 'app-upload-file-details',
  templateUrl: './upload-file-details.component.html',
  styleUrls: [
    '../../../board.component.less',
    './upload-file-details.component.less'
  ],
  encapsulation: ViewEncapsulation.None
})
export class UploadFileDetailsComponent implements OnInit {
  showLoader = false;
  loaderTypeProgress = true;
  step: FormGroup;
  isToEditProduct: boolean;
  buttonText: string;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  tags = [];

  constructor(
    public dialogRef: MatDialogRef<UploadFileDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private boardService: BoardService,
    private eventEmitterService: EventEmitterService
  ) {
    this.step = this.formBuilder.group({
      productTitle: [''],
      brand: '',
      price: [''],
      productListingUrl: [''],
      tags: '',
      keepPrivate: [false]
    });
  }

  ngOnInit(): void {
    if (this.data.product) {
      this.isToEditProduct = true;
      const product = this.data.product;
      this.buttonText = 'Update';
      this.tags = (product.tags && product.tags.split(',')) || [];
      this.step.setValue({
        productTitle: product.name,
        brand: product.brand,
        price: product.price,
        productListingUrl: product.listing_url,
        tags: this.tags,
        keepPrivate: product.is_private === 1
      });
    } else {
      this.buttonText = 'Add';
    }
  }

  onNoClick(): void {
    this.step = this.formBuilder.group({
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
    this.step = this.formBuilder.group({
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
    const payload = {
      name: 'save-image-details',
      data: new Asset({
        is_private: this.step.value.keepPrivate ? 1 : 0,
        name: this.step.value.productTitle,
        brand: this.step.value.brand,
        price: this.step.value.price,
        listing_url: this.step.value.productListingUrl,
        tags: this.tags.join(',')
      })
    };
    if (this.isToEditProduct) {
      this.showLoader = true;
      payload.data.asset_id = this.data.product.asset_id;
      this.boardService.updateAsset(payload.data).subscribe((res) => {
        this.showLoader = false;
        this.eventEmitterService.updateAssets(this.data.product.asset_id);
        // this.onYesClick(res);
      });
    }
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
