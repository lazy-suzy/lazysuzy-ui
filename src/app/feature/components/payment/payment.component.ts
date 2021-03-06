import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Element as StripeElement, Elements, ElementsOptions, StripeService} from 'ngx-stripe';
import {ApiService, EventEmitterService} from 'src/app/shared/services';
import {STATE_LIST} from './../../../shared/constants';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {IOrderAmount} from '../../../shared/models';
import {PromoCodeService} from '../../../shared/services/promo-code/promo-code.service';
import {PixelService} from '../../../shared/services/facebook-pixel/pixel.service';

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
    spinner = 'assets/image/spinner.gif';
    subTotalAmount = 0;
    cartProductsLength: number;
    totalShippingCharge = 0;
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
        billing_zipcode: null,
        promo: ''
    };
    country = 'USA';
    isBillingAddressSame = true;
    isEmailValid = true;
    isRequiredFieldsPresent = true;
    isPaymentExecuting = false;
    cardErrorMsg: string;
    bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
        Breakpoints.Handset
    );
    bpTabletObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
        Breakpoints.Tablet
    );
    bpSubscription: Subscription;
    bpTabletSubscription: Subscription;
    isHandset: boolean;
    isLoading = true;
    localStorageUser = {};
    eventSubscription: Subscription;
    orderAmount: IOrderAmount;
    isStateUpdating: boolean;
    isTablet = false;
    // For PromoCodes
    isPromoCodeBoxVisible = false;
    promoCode: string;
    promoCodeError = false;
    promoCodeErrorMessage: string;
    isPromoCodeApplicable = false;
    promoCodeDiscount = 0;
    promoCodeDetails: any;
    isPromoCodeProcessing: boolean = false;
    stateParam = '';
    promoParam = '';

    constructor(
        private fb: FormBuilder,
        private stripeService: StripeService,
        private apiService: ApiService,
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private eventEmitterService: EventEmitterService,
        private promoCodeService: PromoCodeService,
        private  pixelService: PixelService
    ) {
        this.statesArray = STATE_LIST;
    }

    ngOnInit() {
        this.bpSubscription = this.bpObserver.subscribe(
            (handset: BreakpointState) => {
                this.isHandset = handset.matches;
            }
        );
        this.bpTabletSubscription = this.bpTabletObserver.subscribe(
            (tablet: BreakpointState) => {
                this.isTablet = tablet.matches;
            }
        );

        this.stripeTest = this.fb.group({
            name: ['', [Validators.required]]
        });
        this.stripeService.elements(this.elementsOptions).subscribe((elements) => {
            this.elements = elements;
            // Only mount the element the first time
            if (!this.card) {
                const elementStyles = {
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
                const elementClasses = {
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
        this.eventSubscription = this.eventEmitterService.userChangeEvent
            .asObservable()
            .subscribe((user) => {
             //   this.customerData.email = user.email;
                this.localStorageUser = user;
                this.getCartProducts(false, this.customerData.shipping_state);
            });
    }

    onDestroy(): void {
        this.eventSubscription.unsubscribe();
        this.bpSubscription.unsubscribe();
        this.bpTabletSubscription.unsubscribe();
    }

    decodeHtml(text: string): string {
        const htmlComponent = document.createElement('textarea');
        htmlComponent.innerHTML = text;
        return htmlComponent.value;
    }

    getCartProducts(hasState, state) {
        this.isLoading = true;
        this.apiService.getCartProduct(hasState, state).subscribe(
            (payload: any) => {
                this.cartProducts = payload.products;
                this.orderAmount = payload.order;
                this.customerData.email = payload.user.emailid;
                this.isLoading = false;
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    buy() {
        this.customerData.billing_country = 'USA';
        this.customerData.shipping_country = 'USA';
        const data = this.customerData;
        const condition =
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
                // tslint:disable-next-line: no-unused-expression
                .createToken((this.cardNumber, this.cardExpiry, this.cardCvc), {name})
                .subscribe((result: any) => {
                    if (result.token) {
                        this.customerData.token = result.token.id;
                        this.customerData.ip = result.token.client_ip;
                        localStorage.setItem('registeredName', name);
                        if (this.isPromoCodeApplicable) {
                            this.customerData.promo = this.promoCodeDetails.code;
                        }
                        this.apiService.postStripeToken(this.customerData).subscribe(
                            (payload: any) => {
                                this.isPaymentExecuting = false;
                                if (payload.status === 'succeeded') {
                                    this.pixelService.trackPurchase(payload);
                                    localStorage.setItem('cart', '0');
                                    this.router.navigate([`order/${payload.order_id}`]);
                                } else {
                                    this.isRequiredFieldsPresent = false;
                                    this.cardErrorMsg = payload.errors.message;
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
            const localUser: any = this.localStorageUser;
            if (localUser.email !== this.customerData.email) {
                localStorage.setItem('registeredEmail', this.customerData.email);
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

    shippingStateChanged() {
        this.isStateUpdating = true;
        this.stateParam = this.customerData.shipping_state;
        if (this.isPromoCodeApplicable) {
            this.apiService
                .getCartProduct(true, this.customerData.shipping_state, true, this.promoCodeDetails.code)
                .subscribe(
                    (payload: any) => {
                        this.orderAmount.total_cost = payload.order.total_cost;
                        this.orderAmount.sales_tax_total = payload.order.sales_tax_total;
                        this.isStateUpdating = false;
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
        } else {
            this.apiService
                .getCartProduct(true, this.customerData.shipping_state)
                .subscribe(
                    (payload: any) => {
                        this.orderAmount.total_cost = payload.order.total_cost;
                        this.orderAmount.sales_tax_total = payload.order.sales_tax_total;
                        this.isStateUpdating = false;
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
        }

    }

    showPromoCodeBox() {
        this.isPromoCodeBoxVisible = !this.isPromoCodeBoxVisible;
    }

    checkPromoCode() {
        if (this.promoCode === '' || this.promoCode.length === 0) {
            return;
        }
        this.isPromoCodeProcessing = true;
        this.promoCode = this.promoCode.toUpperCase();
        let urlParams = `promo=${this.promoCode}`;
        if (this.hasStateParam()) {
            urlParams += `&state_code=${this.stateParam}`;
        }
        this.promoCodeService.getPromoCodeProducts(urlParams).subscribe((data: any) => {
            console.log(data);
            // this.promoCode = '';
            const {promo_details} = data;
            if (promo_details.error_msg) {
                this.setPromoCodeIsInvalid(promo_details.error_msg);
                return;
            } else {
                this.applyPromoCode(data);
                this.promoCode = '';
                this.showPromoCodeBox();
            }
        }, (error => console.log(error)), () => this.isPromoCodeProcessing = false);

    }

    applyPromoCode({products, order, promo_details}) {
        this.promoCodeError = false;
        this.isPromoCodeApplicable = true;
        this.promoCodeDiscount = order.total_promo_discount;
        this.orderAmount = order;
        this.promoCodeDetails = promo_details;
        this.cartProducts = products;
    }

    removePromoCode() {
        this.isLoading = true;
        this.isPromoCodeApplicable = false;
        this.apiService.getCartProduct(this.hasStateParam(), this.stateParam).subscribe((payload: any) => {
            this.orderAmount.total_cost = payload.order.total_cost;
            this.orderAmount.sales_tax_total = payload.order.sales_tax_total;
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
        });
        this.orderAmount.total_cost += Number(this.promoCodeDetails.total_discount);
    }

    setPromoCodeIsInvalid(message) {
        this.promoCodeError = true;
        this.promoCodeErrorMessage = message;
    }

    hasStateParam(): boolean {
        return !!this.stateParam;
    }

    saveEmail(emailId) {
        this.apiService.saveCheckoutEmail(emailId).subscribe(response => {
        });
    }
}
