import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.less']
})
export class OrderSuccessComponent implements OnInit {
  cartProducts = [];
  deliveryData: any = [];
  cardDetails: any = [];
  cartProductsLength: number;
  subTotalAmount: number;
  totalShippingCharge: number = 0;
  totalAmount: number;
  perItemShippingCharge = 25;
  orderDate;
  orderId;
  routeSubscription: any;
  password: string;
  showError: boolean;
  isLoggedIn: boolean;
  showSuccess: boolean;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.routeSubscription = this.activeRoute.params.subscribe(routeParams => {
      this.orderId = routeParams.order;
    });
    let localData = JSON.parse(localStorage.getItem('user') || '{}');
    if (localData.user_type === 1) {
      this.isLoggedIn = true;
    }
    this.apiService.getOrderSuccessData(this.orderId).subscribe(
      (payload: any) => {
        this.cartProducts = payload.cart;
        this.deliveryData = payload.delivery;
        this.cardDetails = payload.payment.card;
        this.orderDate = moment(payload.delivery[0].created_at).format(
          'D MMM, YYYY'
        );
        this.cartProductsLength = 0;
        this.subTotalAmount = 0;
        this.calculateCartData();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  calculateCartData() {
    for (let product of this.cartProducts) {
      this.subTotalAmount = this.subTotalAmount + product.price * product.count;
      this.cartProductsLength = this.cartProductsLength + product.count;
      this.totalShippingCharge += product.count * product.ship_custom;
    }
    this.totalAmount = this.subTotalAmount + this.totalShippingCharge;
  }
  updatePassword() {
    if (this.password && this.password.length < 8) {
      this.showError = true;
    } else {
      this.showError = false;
      let data = {
        password: this.password
      };
      this.apiService.userUpdate(data).subscribe(
        (payload: any) => {
          localStorage.setItem('user', JSON.stringify(payload.success.user));
          this.showSuccess = true;
          const self = this;
          setTimeout(function() {
            self.isLoggedIn = true;
          }, 1000);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
}
