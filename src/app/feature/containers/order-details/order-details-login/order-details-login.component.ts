import {Component, OnInit} from '@angular/core';
import {ApiService, EventEmitterService} from '../../../../shared/services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {OrderDetailsService} from '../order-details.service';

@Component({
    selector: 'app-order-details-login',
    templateUrl: './order-details-login.component.html',
    styleUrls: ['./order-details-login.component.less']
})
export class OrderDetailsLoginComponent implements OnInit {

    orderDetailsForm: FormGroup;
    orderDetailsFormError = false;
    orderDetailsErrorFormMessage = '';

    constructor(
        private eventEmitterService: EventEmitterService,
        private fb: FormBuilder,
        private apiService: ApiService,
        private orderDetailsService: OrderDetailsService,
        private router: Router
    ) {
        this.orderDetailsForm = fb.group({
            orderNumber: ['CCHVA', Validators.required],
            zipCode: ['56003', Validators.required],
        });
    }

    ngOnInit() {
    }

    socialSignIn(platform) {
        this.eventEmitterService.socialSignIn(platform);
    }

    submitOrderDetails() {
        if (this.orderDetailsForm.valid) {
            this.orderDetailsService.getOrderDetailsFromApi(
                this.orderDetailsForm.value.orderNumber,
                this.orderDetailsForm.value.zipCode
            ).subscribe((response: any) => {
                if (!response.status) {
                    this.orderDetailsFormError = true;
                    this.orderDetailsErrorFormMessage = response.msg;
                } else {
                    this.orderDetailsService.setOrderDetails(response);
                    this.router.navigate(['order-details', 'view'], {
                        queryParams: this.orderDetailsForm.value
                    });
                }
            });
        }
    }
}
