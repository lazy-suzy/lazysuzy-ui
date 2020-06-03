import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProductPayload, IProductsPayload } from './../../../shared/models';
import { ApiService, EventEmitterService } from './../../../shared/services';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/shared/services';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.less']
})
export class WishlistComponent implements OnInit {
  productsSubscription: Subscription;
  products: IProductPayload[];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        const isBoardApi = false;
        this.productsSubscription = this.apiService
          .getWishlistProducts(isBoardApi)
          .subscribe((payload: IProductsPayload) => {
            this.products = payload.products;
          });
      });
  }
}
