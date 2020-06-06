import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UploadFileDetailsComponent } from '../board-add/add-file-upload/upload-file-details/upload-file-details.component';
import { EventEmitterService } from '../../../shared/services';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.less', '../board.component.less']
})
export class AppProductPreviewComponent implements OnInit {
  @Input() data: any = {};
  @Output() addProductBoard: EventEmitter<any> = new EventEmitter();
  @Output() clearProductPreview: EventEmitter<any> = new EventEmitter();
  dropType = 'default';
  minPrice: number;
  maxPrice: number;
  isEditBtn: boolean;
  eventSubscription: Subscription;
  userId: number;
  constructor(
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.userId = user.id;
        this.updatePriceFormat(this.data.is_price, this.data.price);
        this.isUsersProduct();
      });
  }

  ngOnChanges(changes: any) {
    if (
      changes['data'] &&
      changes['data'].previousValue !== changes['data'].currentValue
    ) {
      this.data = changes['data'].currentValue || {};
      this.isUsersProduct();
      this.updatePriceFormat(this.data.is_price, this.data.price);
      if (this.data.dropType) {
        this.dropType = this.data.dropType;
      }
    }
  }

  addToBoard() {
    this.addProductBoard.emit(this.data);
  }

  clearPreview(data) {
    this.clearProductPreview.emit(data);
  }

  updatePriceFormat(price, searchProductsPrice) {
    let data = price || searchProductsPrice;
    if (!data) {
      this.maxPrice = null;
      this.minPrice = null;
      return;
    }
    let splitedPrice = data.split('-');
    this.minPrice = splitedPrice[0];
    if (splitedPrice.length > 1) {
      this.maxPrice = splitedPrice[1];
    } else {
      this.maxPrice = null;
    }
  }

  isUsersProduct() {
    if (this.userId == this.data.user_id) {
      this.isEditBtn = true;
    } else {
      this.isEditBtn = false;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UploadFileDetailsComponent, {
      width: '450px',
      data: {
        name: '',
        panelClass: 'my-dialog',
        product: this.data
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      let updatedData = result.data;
      this.data.is_private = updatedData.is_private;
      this.data.is_price = updatedData.price;
      this.data.listing_url = updatedData.listing_url;
      this.data.name = updatedData.name;
      this.updatePriceFormat(this.data.is_price, this.data.price);
    });
  }
}
