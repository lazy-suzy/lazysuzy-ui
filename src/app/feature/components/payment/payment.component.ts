import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  StripeService,
  Elements,
  Element as StripeElement,
  ElementsOptions
} from 'ngx-stripe';
import { ApiService } from 'src/app/shared/services';

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

  constructor(private fb: FormBuilder, private stripeService: StripeService, private apiService: ApiService) {}

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
  }

  buy() {
    const name = this.stripeTest.get('name').value;
    this.stripeService.createToken(this.card, { name }).subscribe(result => {
      if (result.token) {
        // Use the token to create a charge or a customer
        // https://stripe.com/docs/charges
        const data = {
          token: result.token.id,
          client_ip: result.token.client_ip,
          created: result.token.created
        };
        this.apiService.postStripeToken(data).subscribe(
          (payload: any) => {
            // console.log(payload);
          },
          (error: any) => {
            console.log(error);
          }
        );
      } else if (result.error) {
        // Error creating the token
        console.log(result.error.message);
      }
    });
  }
}
