import {Component, OnInit, Input, Inject} from '@angular/core';
import {
    ApiService,
    UtilsService,
    EventEmitterService,
    MatDialogUtilsService
} from 'src/app/shared/services';
import {
    BreakpointState,
    Breakpoints,
    BreakpointObserver
} from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {
    isHandset: boolean;
    userCookie: string;
    user: any;
    error = false;
    errorMsg: string;
    name = '';
    email = '';
    password = '';
    thanksMsg = false;
    @Input() isClose = false;
    bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
        Breakpoints.Handset
    );

    bpSubscription: Subscription;

    constructor(
        private apiService: ApiService,
        private utils: UtilsService,
        private eventService: EventEmitterService,
        private breakpointObserver: BreakpointObserver,
        @Inject(MAT_DIALOG_DATA) public data,
        private matDialogUtils: MatDialogUtilsService
    ) {
        console.log(data);
    }

    ngOnInit() {
        this.bpSubscription = this.bpObserver.subscribe(
            (handset: BreakpointState) => {
                this.isHandset = handset.matches;
            }
        );
    }

    onDestroy(): void {
        this.bpSubscription.unsubscribe();
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

    signup(event, name, email, password) {
        event.preventDefault();
        if (this.validateForm(email, password)) {
            const formData: any = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('c_password', password);
            this.apiService.signup(formData).subscribe(
                (payload: any) => {
                    if (payload.success) {
                        this.error = false;
                        this.thanksMsg = true;
                        this.eventService.fetchUser(
                            payload.success.token,
                            payload.success.user
                        );
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

    socialSignIn(platform) {
        this.eventService.socialSignIn(platform);
    }

    openSigninDialog() {
        this.matDialogUtils.openSigninDialog(this.isHandset ? '90%' : '35%', this.data.isClose);
    }
}
