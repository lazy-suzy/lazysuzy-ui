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
  quantity: number = 1;
  quantityArray = [1, 2, 3, 4, 5];
  constructor(
    private breakpointObserver: BreakpointObserver,
    private apiService: ApiService
  ) {}

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
        this.totalAmount = 0;
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

  increaseQuantity(product, quantity) {
    let postData = {
      product_sku: product,
      count: quantity
    };
    this.apiService.addCartProduct(postData).subscribe(
      (payload: any) => {
        this.getCartProducts();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  decreaseQuantity(product, quantity) {
    let postData = {
      product_sku: product,
      count: quantity
    };
    this.apiService.removeCartProduct(postData).subscribe(
      (payload: any) => {
        this.getCartProducts();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getSubTotal() {
    for (let product of this.cartProducts) {
      this.totalAmount =
        this.totalAmount + product.retail_price * product.count;
    }
  }

  removeProduct(product, quantity) {
    this.decreaseQuantity(product, quantity);
  }

  onQuantityChanged(product, count) {
    if (this.quantity >= count) {
      const updateQuantity = this.quantity - count;
      this.increaseQuantity(product, updateQuantity);
    } else {
      const updateQuantity = count - this.quantity;
      this.decreaseQuantity(product, updateQuantity);
    }
  }
}
