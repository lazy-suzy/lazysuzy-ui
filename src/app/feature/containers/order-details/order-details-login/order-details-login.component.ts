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
    signInForm: FormGroup;

    orderDetailsFormError = false;
    orderDetailsErrorFormMessage = '';
    // For Login
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
            orderNumber: ['', Validators.required],
            zipCode: ['', Validators.required],
        });
        this.signInForm = fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    // Getters for form
    get orderNumber() {
        return this.orderDetailsForm.controls.orderNumber;
    }

    get zipCode() {
        return this.orderDetailsForm.controls.zipCode;
    }

    get email() {
        return this.signInForm.controls.email;
    }

    get password() {
        return this.signInForm.controls.password;
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

    login() {
        if (this.signInForm.valid) {
            this.apiService.login(this.signInForm.value).subscribe(
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
        } else {
            this.signInForm.markAllAsTouched();
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
