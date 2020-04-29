import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService, UtilsService } from 'src/app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-cart-product',
  templateUrl: './confirm-cart-product.component.html',
  styleUrls: ['./confirm-cart-product.component.less']
})
export class ConfirmCartProductComponent implements OnInit {
  product = {};
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private router: Router ) { }

  ngOnInit() {
    this.product = this.data;
  }

  closeAllDialogs() {
    this.router.navigate(['cart'])
    .then(() => {
      location.reload();
    });
  }
}
