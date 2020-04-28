import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent implements OnInit {
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );

  bpSubscription: Subscription;
  tabletSubscription: Subscription;
  isHandset: boolean;
  quantityValue: number = 1;
  cartProducts = [];
  totalAmount: number = 0;
  cartProductsLength: number;
  constructor(private breakpointObserver: BreakpointObserver, private apiService: ApiService) {}

  ngOnInit(): void {
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    this.getCartProducts();
  }

  getCartProducts() {
    this.apiService.getCartProduct().subscribe(
      (payload: any) => {
        this.cartProducts = payload;
        this.cartProductsLength = this.cartProducts.length;
        this.getSubTotal();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.bpSubscription.unsubscribe();
  }

  increaseQuantity() {
    this.quantityValue += 1;
  }

  decreaseQuantity() {
    this.quantityValue -= 1;
  }

  getSubTotal() {
    for (let product of this.cartProducts) {
      this.totalAmount = this.totalAmount + (product.price * product.count);
    }
  }

  removeProduct(product) {
    this.apiService.removeCartProduct(product).subscribe(
      (payload: any) => {
        this.getCartProducts();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
