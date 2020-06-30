import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
import {
  ApiService,
  MatDialogUtilsService,
  EventEmitterService
} from 'src/app/shared/services';
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
  quantityValue = 1;
  cartProducts = [];
  subTotal = 0;
  cartProductsLength: number;
  isProductFetching: boolean;
  spinner = 'assets/image/spinner.gif';
  emptyCart = true;
  isCartLoading: boolean;
  isLoggedIn: boolean;
  eventSubscription: Subscription;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private apiService: ApiService,
    private matDialogUtils: MatDialogUtilsService,
    private router: Router,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.isCartLoading = true;
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        if (user.user_type === 1) {
          this.isLoggedIn = true;
        }
        this.getCartProducts();
      });
  }

  getCartProducts() {
    this.isProductFetching = true;
    this.apiService.getCartProduct(false, null).subscribe(
      (payload: any) => {
        this.cartProducts = payload.products;
        this.cartProductsLength = 0;
        this.emptyCart = this.cartProducts.length === 0;
        this.subTotal = payload.order.sub_total;
        this.isCartLoading = false;
        this.isProductFetching = false;
      },
      (error: any) => {
        this.isCartLoading = false;
        this.isProductFetching = false;
        this.emptyCart = true;
        console.log(error);
      }
    );
  }

  onDestroy(): void {
    this.bpSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
  }

  increaseQuantity(product, quantity) {
    const postData = {
      product_sku: product.product_sku,
      count: quantity,
      parent_sku: product.parent_sku
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
    const postData = {
      product_sku: product.product_sku,
      count: quantity,
      parent_sku: product.parent_sku
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
    this.matDialogUtils.openMatDialog(sku);
  }

  openProductPage(sku) {
    this.router.navigate([`product/${sku}`]);
  }

  openSignupDialog(device) {
    this.matDialogUtils.openSignupDialog(device);
  }

  seeMore(category) {
    this.router.navigateByUrl(`/products/all?${category}=true`);
  }

  counter(i: number) {
    return new Array(i);
  }
}
