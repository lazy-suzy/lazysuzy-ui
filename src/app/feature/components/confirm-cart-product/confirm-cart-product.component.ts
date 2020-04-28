import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-cart-product',
  templateUrl: './confirm-cart-product.component.html',
  styleUrls: ['./confirm-cart-product.component.less']
})
export class ConfirmCartProductComponent implements OnInit {
  product = {};
  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.product = this.data;
  }

}
