import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { ApiService, UtilsService } from 'src/app/shared/services';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit {
  @ViewChild('closeLoginModal', { static: false }) closeLoginModal: ElementRef;
  @ViewChild('closeSignupModal', { static: false })
  closeSignupModal: ElementRef;
  @ViewChild('signupBtn', { static: false }) signupBtn: ElementRef;

  @Input() handset: boolean;
  userCookie: string;
  user: any;
  googleRedirect = env.GOOGLE_LINK;
  facebookRedirect = env.FACEBOOK_LINK;
  error: boolean = false;
  errorMsg: string;
  name: string = '';
  email: string = '';
  password: string = '';
  thanksMsg: boolean = false;
  constructor(
    private socialAuthService: AuthService,
    private apiService: ApiService,
    private cookie: CookieService,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.fetchUser();
  }

  ngAfterViewInit() {
    this.utils.setSignupRef(this.signupBtn);
  }

  fetchUser() {
    this.userCookie = this.cookie.get('token');
    if (this.userCookie) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else {
      return;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
      console.log(userData);
      this.apiService
        .getAuthToken(userData.authToken)
        .subscribe((payload: any) => {
          this.cookie.set('token', `Bearer ${payload.access_token}`);
          localStorage.setItem('user', JSON.stringify(userData));
          this.fetchUser();
          this.closeLoginModal.nativeElement.click();
          this.closeSignupModal.nativeElement.click();
        });
    });
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
            this.cookie.set('token', payload.success.token);
            localStorage.setItem('user', JSON.stringify(payload.user));
            this.closeLoginModal.nativeElement.click();
            this.fetchUser();
          } else {
            this.handleError(payload);
          }
        },
        (payload: any) => this.handleError(payload.error)
      );
    }
  }

  signup(event, name, email, password) {
    event.preventDefault();
    if (this.validateForm(email, password)) {
      var formData: any = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('c_password', password);
      this.apiService.signup(formData).subscribe(
        (payload: any) => {
          if (payload.success) {
            this.error = false;
            this.cookie.set('token', payload.success.token);
            localStorage.setItem('user', JSON.stringify(payload.success.user));
            this.thanksMsg = true;
            const self = this;
            setTimeout(function() {
              self.closeSignupModal.nativeElement.click();
            }, 2000);
            this.fetchUser();
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

  logout() {
    this.cookie.set('token', '');
    localStorage.removeItem('user');
    this.fetchUser();
  }
}
