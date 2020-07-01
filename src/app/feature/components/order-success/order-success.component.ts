import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { EventEmitterService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
import { IOrderAmount } from '../../../shared/models';

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
  totalShippingCharge = 0;
  totalAmount: number;
  perItemShippingCharge = 25;
  orderDate;
  orderId;
  routeSubscription: any;
  password: string;
  showError: boolean;
  isLoggedIn: boolean;
  showSuccess: boolean;
  eventSubscription: Subscription;
  orderAmount: IOrderAmount;
  isLoading: boolean;
  spinner = 'assets/image/spinner.gif';
  constructor(
    private apiService: ApiService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.routeSubscription = this.activeRoute.params.subscribe(
      (routeParams) => {
        this.orderId = routeParams.order;
      }
    );
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.isLoggedIn = user.user_type === 1;
        this.apiService.getOrderSuccessData(this.orderId).subscribe(
          (payload: any) => {
            this.cartProducts = payload.cart.products;
            this.orderAmount = payload.cart.order;
            this.deliveryData = payload.delivery;
            this.cardDetails = payload.payment.card;
            this.orderDate = moment(payload.delivery[0].created_at).format(
              'D MMM, YYYY'
            );
            this.isLoading = false;
          },
          (error: any) => {
            console.log(error);
            this.isLoading = false;
          }
        );
      });
  }
  onDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

  updatePassword() {
    if (this.password && this.password.length < 8) {
      this.showError = true;
    } else {
      this.showError = false;
      // const localUser: any = JSON.parse(localStorage.getItem('user') || '{}');
      const registeredEmail = localStorage.getItem('registeredEmail') || '';
      const registeredName = localStorage.getItem('registeredName') || '';
      const data = {
        name: registeredName,
        email: registeredEmail,
        password: this.password
      };
      this.apiService.userUpdate(data).subscribe(
        (payload: any) => {
          localStorage.setItem('user', JSON.stringify(payload.success.user));
          this.showSuccess = true;
          const self = this;
          setTimeout(() => {
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
