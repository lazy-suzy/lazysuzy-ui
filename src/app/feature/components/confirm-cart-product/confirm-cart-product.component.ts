import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ApiService,
  UtilsService,
  EventEmitterService
} from 'src/app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-cart-product',
  templateUrl: './confirm-cart-product.component.html',
  styleUrls: ['./confirm-cart-product.component.less']
})
export class ConfirmCartProductComponent implements OnInit {
  product: any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private utils: UtilsService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.product = this.data;
    this.utils.updateLocalCart(this.product.quantity);
    this.eventEmitterService.updateCartIcon();
  }

  closeAllDialogs() {
    this.router.navigate(['cart']).then(() => {
      location.reload();
    });
  }
}
