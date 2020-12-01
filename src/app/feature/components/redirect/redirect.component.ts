import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ApiService, EventEmitterService, MatDialogUtilsService, UtilsService} from '../../../shared/services';
import {CookieService} from 'ngx-cookie-service';

@Component({
    selector: 'app-redirect',
    templateUrl: './redirect.component.html',
    styleUrls: ['./redirect.component.less']
})
export class RedirectComponent implements OnInit {
    @Input() isHandset: boolean;
    @Input() isWishlisted;
    @Output() wishlist = new EventEmitter();
    showLogin = false;
    email = '';
    password = '';
    error;
    errorMsg = '';
    private attribute = {
        postGuestKey: 'guest',
        lsGuestUser: 'guest-user',
        lsGuestUserToken: 'guest-token',
        lsRegularUser: 'user',
        cookieUserRegularToken: 'token'
    };

    constructor(
        private matDialogUtils: MatDialogUtilsService,
        private cookie: CookieService,
        private apiService: ApiService,
        private utils: UtilsService,
        private eventService: EventEmitterService
    ) {
    }

    ngOnInit() {
    }

    openSignup() {
        this.matDialogUtils.openSignupDialog(this.isHandset, true);
    }

    enableLogin() {
        this.showLogin = true;
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

    handleError(payload: any) {
        this.error = true;
        this.errorMsg = payload.error;
    }

    login() {
        if (this.validateForm(this.email, this.password)) {
            const formData: any = new FormData();
            formData.append('name', name);
            formData.append('email', this.email);
            formData.append('password', this.password);
            formData.append('c_password', this.password);
            this.apiService.signup(formData).subscribe(
                (payload: any) => {
                    if (payload.success) {
                        this.error = false;
                        this.eventService.fetchUser(
                            payload.success.token,
                            payload.success.user
                        );
                        this.markWishlist();
                        this.matDialogUtils.closeDialogs();
                    }
                },
                (error: any) => {
                    if (error.error.error.email) {
                        this.error = true;
                        this.errorMsg = 'This email already exists';
                        return false;
                    }
                }
            );
        }
    }

    checkLogin() {
        const user: any = JSON.parse(localStorage.getItem('user'));
        console.log(user, user.user_type !== this.utils.userType.guest);
        if (user.user_type && user.user_type !== this.utils.userType.guest) {
            this.markWishlist();
        } else {
            this.enableLogin();
        }
    }

    markWishlist() {
        this.wishlist.emit(true);
    }
}
