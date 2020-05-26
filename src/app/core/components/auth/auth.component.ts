import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import {
  ApiService,
  UtilsService,
  EventEmitterService,
} from 'src/app/shared/services';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less'],
})
export class AuthComponent implements OnInit {
  @ViewChild('closeLoginModal', { static: false }) closeLoginModal: ElementRef;
  @ViewChild('closeSignupModal', { static: false })
  closeSignupModal: ElementRef;
  @ViewChild('signupBtn', { static: false }) signupBtn: ElementRef;

  @Input() isHandset: boolean;
  userCookie: string;
  user: any;
  initials: any;
  googleRedirect = env.GOOGLE_LINK;
  facebookRedirect = env.FACEBOOK_LINK;
  error: boolean = false;
  errorMsg: string;
  name: string = '';
  email: string = '';
  password: string = '';
  thanksMsg: boolean = false;
  expiredDate = new Date();

  constructor(
    private socialAuthService: AuthService,
    private apiService: ApiService,
    private cookie: CookieService,
    private utils: UtilsService,
    private eventEmitterService: EventEmitterService
  ) {
    this.expiredDate.setMonth(this.expiredDate.getMonth() + 6);
  }

  ngOnInit() {
    this.fetchUser();
    localStorage.setItem('cart', '0');
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeFetchUser.subscribe(
        (payload) => {
          this.cookie.set('token', `${payload.token}`, this.expiredDate, '/');
          localStorage.setItem('user', JSON.stringify(payload.user));
          this.fetchUser();
        }
      );
      this.eventEmitterService.socialSubs = this.eventEmitterService.invokeSocialLogin.subscribe(
        (platform) => {
          debugger;
          this.socialSignIn(platform);
        }
      );
    }
  }

  fetchUser() {
    this.userCookie = this.cookie.get('token');
    if (this.userCookie) {
      this.user = JSON.parse(localStorage.getItem('user'));
      const initials = this.user.name.match(/\b\w/g) || [];
      this.initials = (
        (initials.shift() || '') + (initials.pop() || '')
      ).toUpperCase();
    }
  }

  closeMyMenu() {}

  public socialSignIn(socialPlatform: string) {
    debugger;
    let socialPlatformProvider;
    if (socialPlatform == 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else {
      return;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then((userData) => {
      console.log(userData);
      this.apiService
        .getAuthToken(userData.authToken, socialPlatform)
        .subscribe((payload: any) => {
          this.cookie.set(
            'token',
            `${payload.access_token}`,
            this.expiredDate,
            '/'
          );
          localStorage.setItem('user', JSON.stringify(userData));
          this.fetchUser();
          this.closeLoginModal.nativeElement.click();
          this.closeSignupModal.nativeElement.click();
        });
    });
  }

  handleError(payload: any) {
    this.error = true;
    this.errorMsg = payload.error;
  }

  openSignupDialog() {
    this.utils.openSignupDialog(this.isHandset);
  }

  logout() {
    // change user type to guest on logout
    let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

    if (userInLocalStorage && userInLocalStorage.hasOwnProperty('user_type')) {
      userInLocalStorage.user_type = this.utils.userType.guest;
      localStorage.setItem('user', JSON.stringify(userInLocalStorage));
      this.fetchUser();
    }
    // handling previous version of the database
    else {
      this.cookie.set('token', '');
      localStorage.removeItem('user');
      this.fetchUser();
    }
    window.location.reload();
  }

  isCurrentUserGuest(): boolean {
    return this.user.user_type === this.utils.userType.guest;
  }
  // async createGuestUserIfRequired() {
  //   // no trace of user
  //   if (!this.cookie.get('token') && !localStorage.getItem('user')) {
  //     var formData: any = new FormData();
  //     formData.append('guest', 1);

  //     const payload: any = await this.apiService.signup(formData).toPromise();
  //     if (payload.success) {
  //       this.cookie.set('token', payload.success.token, undefined, '/');
  //       localStorage.setItem('user', JSON.stringify(payload.success.user));
  //       this.fetchUser();
  //     }
  //   } else this.fetchUser();
  // }
}
