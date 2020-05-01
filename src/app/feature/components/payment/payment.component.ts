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
    created: null,
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
  isBillingAddressSame: boolean;
  isLoading: boolean;
  spinner: string = 'assets/images/spinner.gif';
  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private apiService: ApiService,
    private usStateService: USStateService
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
    this.totalShippingCharge =
      this.cartProductsLength * this.perItemShippingCharge;
    this.totalAmount = this.subTotalAmount + this.totalShippingCharge;
  }
  buy() {
    const name = this.stripeTest.get('name').value;
    this.isLoading = true;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe((result: any) => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          this.customerData.token = result.token.id;
          this.customerData.ip = result.token.client_ip;
          this.customerData.created = result.token.created;
          this.apiService.postStripeToken(this.customerData).subscribe(
            (payload: any) => {
              console.log(payload);
              alert(JSON.stringify(payload));
              this.isLoading = false;
            },
            (error: any) => {
              console.log(error);
              alert(JSON.stringify(error));
              this.isLoading = false;
            }
          );
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

  updateAccordion(section) {
    this.customer = false;
    this.billing = false;
    this.shipping = false;
    this.payment = false;
    if (section === 'billing' && this.isBillingAddressSame) {
      this.payment = true;
    } else {
      this[section] = true;
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
    }
  }
}
