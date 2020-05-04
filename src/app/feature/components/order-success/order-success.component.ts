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
  cartProductsLength: number;
  subTotalAmount: number;
  totalShippingCharge: number;
  totalAmount: number;
  perItemShippingCharge = 25;
  orderDate;
  orderId;
  routeSubscription: any;
  constructor(private apiService: ApiService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.routeSubscription = this.activeRoute.params.subscribe(routeParams => {
      this.orderId = routeParams.order;
    });
    this.apiService.getOrderSuccessData(this.orderId).subscribe(
      (payload: any) => {
        this.cartProducts = payload.cart;
        this.orderDate = moment(payload.delivery[0].created_at).format('D MMM, YYYY');
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
    }
    this.totalShippingCharge = this.cartProductsLength * this.perItemShippingCharge;
    this.totalAmount = this.subTotalAmount + this.totalShippingCharge;
  }
}
