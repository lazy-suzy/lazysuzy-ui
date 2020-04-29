import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService, UtilsService } from 'src/app/shared/services';

@Component({
  selector: 'app-confirm-cart-product',
  templateUrl: './confirm-cart-product.component.html',
  styleUrls: ['./confirm-cart-product.component.less']
})
export class ConfirmCartProductComponent implements OnInit {
  product = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.product = this.data;
  }

  closeAllDialogs() {
    this.utils.closeAllDialog();
  }
}
