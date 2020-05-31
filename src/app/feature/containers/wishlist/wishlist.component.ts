import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProductPayload, IProductsPayload } from './../../../shared/models';
import { ApiService } from './../../../shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.less']
})
export class WishlistComponent implements OnInit {
  productsSubscription: Subscription;
  products: IProductPayload[];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const isBoardApi = false;
    this.productsSubscription = this.apiService
      .getWishlistProducts(isBoardApi)
      .subscribe((payload: IProductsPayload) => {
        this.products = payload.products;
      });
  }
}
