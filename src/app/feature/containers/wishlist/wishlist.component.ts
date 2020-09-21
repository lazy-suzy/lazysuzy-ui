import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IProductPayload, IProductsPayload } from './../../../shared/models';
import { ApiService, EventEmitterService } from './../../../shared/services';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.less']
})
export class WishlistComponent implements OnInit {
  productsSubscription: Subscription;
  products: IProductPayload[];
  eventSubscription: Subscription;
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  bpSubscription: Subscription;
  isHandset: boolean;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    this.eventSubscription = this.eventEmitterService.userChangeEvent
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

  onDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
