import { Component, OnInit, Input } from '@angular/core';
import {
  ApiService,
  UtilsService,
  EventEmitterService
} from 'src/app/shared/services';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.less']
})
export class SigninComponent implements OnInit {
  isHandset: boolean;
  userCookie: string;
  user: any;
  error: boolean = false;
  errorMsg: string;
  email: string = '';
  password: string = '';
  thanksMsg: boolean = false;

  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  bpSubscription: Subscription;

  constructor(
    private apiService: ApiService,
    private utils: UtilsService,
    private eventService: EventEmitterService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
  }

  ngOnDestroy(): void {
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
            this.utils.closeDialogs();
          } else {
            this.handleError(payload);
          }
        },
        (payload: any) => this.handleError(payload.error)
      );
    }
  }

  socialSignIn(platform) {
    this.eventService.socialSignIn(platform);
  }

  openSignupDialog() {
    this.utils.openSignupDialog(this.isHandset);
  }

  closeDialogs() {
    this.utils.closeDialogs();
  }
}
