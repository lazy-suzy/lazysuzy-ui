import {Component, OnInit} from '@angular/core';
import {ApiService, EventEmitterService, MatDialogUtilsService} from '../../../../shared/services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {OrderDetailsService} from '../order-details.service';
import {AuthGuardService} from '../../../../shared/services/auth/auth-guard.service';

@Component({
    selector: 'app-order-details-login',
    templateUrl: './order-details-login.component.html',
    styleUrls: ['./order-details-login.component.less']
})
export class OrderDetailsLoginComponent implements OnInit {

    // Form Groups
    orderDetailsForm: FormGroup;


    orderDetailsFormError = false;
    orderDetailsErrorFormMessage = '';
    // For Login
    email = '';
    password = '';
    error;
    errorMsg = '';

    constructor(
        private eventEmitterService: EventEmitterService,
        private fb: FormBuilder,
        private apiService: ApiService,
        private orderDetailsService: OrderDetailsService,
        private router: Router,
        private matDialogUtilsService: MatDialogUtilsService,
        private eventService: EventEmitterService,
        private authGuardService: AuthGuardService,
    ) {
        this.orderDetailsForm = fb.group({
            orderNumber: ['CCHVA', Validators.required],
            zipCode: ['56003', Validators.required],
        });
    }

    ngOnInit() {
        this.checkIfUserLoggedIn();
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

    openSignUpDialog() {
        this.matDialogUtilsService.openSignupDialog();
    }

    validateForm(email, password) {
        this.error = false;
        if (!email) {
            this.error = true;
            this.errorMsg = 'Email cannot be blank';
        } else if (!password) {
            this.error = true;
            this.errorMsg = 'Password cannot be blank';
        } else if (password.length < 8) {
            this.error = true;
            this.errorMsg = 'Password must contain 8 characters';
        }
        return !this.error;
    }

    login(event, email, password) {
        event.preventDefault();
        if (this.validateForm(email, password)) {
            const formData: any = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            this.apiService.login(formData).subscribe(
                (payload: any) => {
                    if (payload.success) {
                        this.error = false;
                        this.eventService.fetchUser(payload.success.token, payload.user);
                        this.navigateToOrderDetailsView();
                    } else {
                        this.handleError(payload);
                    }
                },
                (payload: any) => this.handleError(payload.error)
            );
        }
    }

    handleError(payload: any) {
        this.error = true;
        this.errorMsg = payload.error;
    }

    navigateToOrderDetailsView() {
        this.router.navigate(['order-details', 'view']);
    }

    private checkIfUserLoggedIn() {
        if (!this.authGuardService.isGuest()) {
            this.navigateToOrderDetailsView();
        }
    }
}
