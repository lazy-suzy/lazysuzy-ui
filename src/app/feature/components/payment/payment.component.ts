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
import { USStateService } from 'ng2-us-states';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.less']
})
export class PaymentComponent implements OnInit {
  elements: Elements;
  card: StripeElement;

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
  subTotalAmount: number = 0;
  cartProductsLength: number;
  totalShippingCharge: number;
  perItemShippingCharge = 25;
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
  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private apiService: ApiService,
    private usStateService: USStateService,
    private router: Router
  ) {
    this.statesArray = this.usStateService.getStates();
  }

  ngOnInit() {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.stripeService.elements(this.elementsOptions).subscribe(elements => {
      this.elements = elements;
      // Only mount the element the first time
      if (!this.card) {
        this.card = this.elements.create('card', {
          style: {
            base: {
              iconColor: '#666EE8',
              color: '#31325F',
              lineHeight: '40px',
              fontWeight: 300,
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSize: '18px',
              '::placeholder': {
                color: '#CFD7E0'
              }
            }
          }
        });
        this.card.mount('#card-element');
      }
    });
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
    }
    if (this.cartProductsLength === 0) {
      this.router.navigate(['cart']);
    }
    this.totalShippingCharge =
      this.cartProductsLength * this.perItemShippingCharge;
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
      // const name = this.stripeTest.get('name').value;
      const name =
        this.customerData.billing_f_Name +
        ' ' +
        this.customerData.billing_l_Name;
      this.stripeService
        .createToken(this.card, { name })
        .subscribe((result: any) => {
          if (result.token) {
            // Use the token to create a charge or a customer
            // https://stripe.com/docs/charges
            this.customerData.token = result.token.id;
            this.customerData.ip = result.token.client_ip;
            this.apiService.postStripeToken(this.customerData).subscribe(
              (payload: any) => {
                console.log(payload);
                this.isPaymentExecuting = false;
                this.router.navigate([`order/${payload.order_id}`])
                .then(() => {
                  location.reload();
                });
              },
              (error: any) => {
                console.log(error);
                this.isPaymentExecuting = false;
              }
            );
          } else if (result.error) {
            this.isPaymentExecuting = false;
            // if(result.error === 'Your card number is incomplete.' ||
            // result.error === "Your card's expiration date is incomplete."
            // || result.error === "Your card's security code is incomplete."){
            //   this.isRequiredFieldsPresent = false;
            //   this.cardErrorMsg = 'Incomplete Card Details';
            // } else
            // if (result.error === 'Your card number is invalid.') {
            //   this.isRequiredFieldsPresent = false;
            //   this.cardErrorMsg = 'Invalid Card Details';
            // }
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
      if ( !this.customerData.billing_f_Name) {
        this.billing = true;
      } else
      if (this.isBillingAddressSame) {
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
