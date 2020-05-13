import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import {
  StripeService,
  Elements,
  Element as StripeElement,
  ElementsOptions
} from 'ngx-stripe';
import { ApiService } from 'src/app/shared/services';
import { STATE_LIST } from './../../../shared/constants';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.less']
})
export class PaymentComponent implements OnInit {
  elements: Elements;
  card: StripeElement;
  cardNumber: StripeElement;
  cardExpiry: StripeElement;
  cardCvc: StripeElement;
  // optional parameters
  elementsOptions: ElementsOptions = {};
  stripeTest: FormGroup;
  customerEmail: string;
  customer = true;
  shipping = false;
  billing = false;
  payment = false;
  statesArray = [];
  cartProducts = [];
  spinner: string = 'assets/images/spinner.gif';
  subTotalAmount: number = 0;
  cartProductsLength: number;
  totalShippingCharge: number = 0;
  totalAmount: number;
  customerData = {
    email: null,
    name: null,
    token: null,
    ip: null,
    shipping_f_Name: null,
    shipping_l_Name: null,
    shipping_company_name: null,
    shipping_phone: null,
    shipping_address_line1: null,
    shipping_address_line2: null,
    shipping_city: null,
    shipping_country: null,
    shipping_state: null,
    shipping_zipcode: null,
    billing_f_Name: null,
    billing_l_Name: null,
    billing_company_name: null,
    billing_phone: null,
    billing_address_line1: null,
    billing_address_line2: null,
    billing_city: null,
    billing_country: null,
    billing_state: null,
    billing_zipcode: null
  };
  country = 'USA';
  isBillingAddressSame: boolean = true;
  isEmailValid: boolean = true;
  isRequiredFieldsPresent: boolean = true;
  isPaymentExecuting: boolean = false;
  cardErrorMsg: string;
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  bpSubscription: Subscription;
  isHandset: boolean;
  isLoading: boolean = true;
  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private apiService: ApiService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.statesArray = STATE_LIST;
  }

  ngOnInit() {
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.stripeService.elements(this.elementsOptions).subscribe(elements => {
      this.elements = elements;
      // Only mount the element the first time
      if (!this.card) {
        
        let elementStyles = {
          base: {
            color: '#32325D',
            fontWeight: 500,
            fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            '::placeholder': {
              color: '#CFD7DF'
            },
            ':-webkit-autofill': {
              color: '#e39f48'
            }
          },
          invalid: {
            color: '#E25950',
            '::placeholder': {
              color: '#FFCCA5'
            }
          }
        };
        let elementClasses = {
          focus: 'focused',
          empty: 'empty',
          invalid: 'invalid'
        };
        this.cardNumber = this.elements.create('cardNumber', {
          style: elementStyles
        });
        this.cardNumber.mount('#form-card-number');
        this.cardExpiry = this.elements.create('cardExpiry', {
          style: elementStyles
        });
        this.cardExpiry.mount('#form-card-expiry');
        this.cardCvc = this.elements.create('cardCvc', {
          style: elementStyles
        });
        this.cardCvc.mount('#form-card-cvc');
      }
    });
    const localUser: any = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerData.email = localUser.email;
    this.getCartProducts();
  }

  getCartProducts() {
    this.apiService.getCartProduct().subscribe(
      (payload: any) => {
        this.cartProducts = payload;
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
      this.subTotalAmount =
        this.subTotalAmount + product.retail_price * product.count;
      this.cartProductsLength = this.cartProductsLength + product.count;
      this.totalShippingCharge += product.count * product.ship_custom;
    }
    if (this.cartProductsLength === 0) {
      this.router.navigate(['cart']);
    } else {
      this.isLoading = false;
    }
    this.totalAmount = this.subTotalAmount + this.totalShippingCharge;
  }
  buy() {
    this.customerData.billing_country = 'USA';
    this.customerData.shipping_country = 'USA';
    let data = this.customerData;
    let condition =
      data.email &&
      data.shipping_f_Name &&
      data.shipping_l_Name &&
      data.shipping_address_line1 &&
      data.shipping_state &&
      data.shipping_zipcode &&
      data.shipping_phone &&
      data.shipping_country &&
      data.shipping_city &&
      data.billing_f_Name &&
      data.billing_l_Name &&
      data.billing_address_line1 &&
      data.billing_state &&
      data.billing_zipcode &&
      data.billing_phone &&
      data.billing_country &&
      data.billing_city;
    if (condition) {
      this.isPaymentExecuting = true;
      this.isRequiredFieldsPresent = true;
      const name =
        this.customerData.billing_f_Name +
        ' ' +
        this.customerData.billing_l_Name;
      this.stripeService
        .createToken((this.cardNumber, this.cardExpiry, this.cardCvc), { name })
        .subscribe((result: any) => {
          if (result.token) {
            this.customerData.token = result.token.id;
            this.customerData.ip = result.token.client_ip;
            this.apiService.userUpdate({ name }).subscribe(
              (payload: any) => {
                localStorage.setItem(
                  'user',
                  JSON.stringify(payload.success.user)
                );
              },
              (error: any) => {
                console.log(error);
              }
            );
            this.apiService.postStripeToken(this.customerData).subscribe(
              (payload: any) => {
                this.isPaymentExecuting = false;
                if(payload.status==='succeeded'){
                  this.router.navigate([`order/${payload.order_id}`]);
                } else {
                  this.isRequiredFieldsPresent = false
                  this.cardErrorMsg = payload.errors.message
                }
                
              },
              (error: any) => {
                this.isPaymentExecuting = false;
              }
            );
          } else if (result.error) {
            this.isPaymentExecuting = false;
            // Error creating the token
            console.log(result.error.message);
          }
        });
    } else {
      this.isRequiredFieldsPresent = false;
      this.cardErrorMsg = 'Please fill all the required fields';
    }
  }

  updateAccordion(section) {
    this.customer = false;
    this.billing = false;
    this.shipping = false;
    this.payment = false;
    if (section === 'billing') {
      this.onCheckboxChange(this.isBillingAddressSame);
      if (!this.customerData.billing_f_Name) {
        this.billing = true;
      } else if (this.isBillingAddressSame) {
        this.payment = true;
      }
    } else {
      this[section] = true;
    }
  }

  checkEmailValidation() {
    const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      String(this.customerData.email).toLowerCase()
    );
    if (!emailformat) {
      this.customer = true;
      this.isEmailValid = false;
    } else {
      const localUser: any = JSON.parse(localStorage.getItem('user') || '{}');
      if (localUser.email !== this.customerData.email) {
        const data = {
          email: this.customerData.email
        };
        this.apiService.userUpdate(data).subscribe(
          (payload: any) => {
            localStorage.setItem('user', JSON.stringify(payload.success.user));
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
      this.shipping = true;
      this.customer = false;
      this.isEmailValid = true;
    }
  }
  onCheckboxChange(checked) {
    this.isBillingAddressSame = checked;
    if (this.isBillingAddressSame) {
      this.customerData.billing_f_Name = this.customerData.shipping_f_Name;
      this.customerData.billing_l_Name = this.customerData.shipping_l_Name;
      this.customerData.billing_company_name = this.customerData.shipping_company_name;
      this.customerData.billing_phone = this.customerData.shipping_phone;
      this.customerData.billing_address_line1 = this.customerData.shipping_address_line1;
      this.customerData.billing_address_line2 = this.customerData.shipping_address_line2;
      this.customerData.billing_city = this.customerData.shipping_city;
      this.customerData.billing_country = this.customerData.shipping_country;
      this.customerData.billing_state = this.customerData.shipping_state;
      this.customerData.billing_zipcode = this.customerData.shipping_zipcode;
    } else {
      this.customerData.billing_f_Name = '';
      this.customerData.billing_l_Name = '';
      this.customerData.billing_company_name = '';
      this.customerData.billing_phone = '';
      this.customerData.billing_address_line1 = '';
      this.customerData.billing_address_line2 = '';
      this.customerData.billing_city = '';
      this.customerData.billing_country = '';
      this.customerData.billing_state = '';
      this.customerData.billing_zipcode = '';
    }
  }
}
