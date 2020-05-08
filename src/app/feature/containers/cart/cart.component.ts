import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
import { ApiService, UtilsService } from 'src/app/shared/services';
import { Router } from '@angular/router';

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
  isProductFetching: boolean;
  spinner: string = 'assets/images/spinner.gif';
  emptyCart: boolean = true;
  isCartLoading: boolean;
  isLoggedIn: boolean;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private apiService: ApiService,
    private utilsService: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isCartLoading = true;
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    let localData = JSON.parse(localStorage.getItem('user') || '{}');
    if (localData.user_type === 1) {
      this.isLoggedIn = true;
    }
    this.getCartProducts();
  }

  getCartProducts() {
    this.isProductFetching = true;
    this.apiService.getCartProduct().subscribe(
      (payload: any) => {
        this.cartProducts = payload;
        this.cartProductsLength = 0;
        this.emptyCart = this.cartProducts.length === 0;
        this.totalAmount = 0;
        this.getSubTotal();
        this.isCartLoading = false;
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
      this.cartProductsLength = this.cartProductsLength + product.count;
    }
    this.isProductFetching = false;
  }

  removeProduct(product, quantity) {
    this.decreaseQuantity(product, quantity);
  }

  onQuantityChanged(product, count, quantity) {
    if (quantity >= count) {
      const updateQuantity = quantity - count;
      this.increaseQuantity(product, updateQuantity);
    } else {
      const updateQuantity = count - quantity;
      this.decreaseQuantity(product, updateQuantity);
    }
  }

  openProductDetail(sku) {
    this.utilsService.openMatDialog(sku);
  }

  openProductPage(sku) {
    this.router.navigate([`product/${sku}`]);
  }

  openSignupDialog(device) {
    this.utilsService.openSignupDialog(device);
  }

  seeMore(category) {
    this.router.navigateByUrl(`/products/all?${category}=true`);
  }

  counter(i: number) {
    return new Array(i);
  }
}
