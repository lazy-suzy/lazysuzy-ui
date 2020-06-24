import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import {
  ApiService,
  UtilsService,
  EventEmitterService,
  MatDialogUtilsService
} from 'src/app/shared/services';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit {
  @ViewChild('closeLoginModal', { static: false }) closeLoginModal: ElementRef;
  @ViewChild('closeSignupModal', { static: false })
  @ViewChild('signupBtn', { static: false })
  signupBtn: ElementRef;
  closeSignupModal: ElementRef;

  @Input() isHandset: boolean;
  user: any;
  initials: any;
  googleRedirect = env.GOOGLE_LINK;
  facebookRedirect = env.FACEBOOK_LINK;
  name = '';
  expiredDate = new Date();
  initialized = false;
  hasPicture: boolean;
  private attribute = {
    postGuestKey: 'guest',
    lsGuestUser: 'guest-user',
    lsGuestUserToken: 'guest-token',
    lsRegularUser: 'user',
    cookieUserRegularToken: 'token'
  };

  constructor(
    private socialAuthService: AuthService,
    private apiService: ApiService,
    private cookie: CookieService,
    private utils: UtilsService,
    private eventEmitterService: EventEmitterService,
    private matDialogUtils: MatDialogUtilsService
  ) {
    this.expiredDate.setMonth(this.expiredDate.getMonth() + 6);
  }

  ngOnInit() {
    // localStorage.setItem('cart', '0');
    if (this.initialized === false) {
      this.eventEmitterService.invokeFetchUser.subscribe((payload) => {
        this.cookie.set(
          this.attribute.cookieUserRegularToken,
          payload.token,
          this.expiredDate,
          '/'
        );
        this.hasPicture =
          payload.user.picture && payload.user.picture !== null ? true : false;
        payload.user.picture = env.BASE_HREF + payload.user.picture;
        localStorage.setItem(
          this.attribute.lsRegularUser,
          JSON.stringify(payload.user)
        );
        this.updateUser(payload.user);
      });
      this.eventEmitterService.invokeSocialLogin.subscribe((platform) => {
        this.socialSignIn(platform);
      });
      this.eventEmitterService.userChangeEvent
        .asObservable()
        .subscribe((user) => {
          this.user = user;
          this.initialized = true;
        });
    }
    this.resolveUser();
  }
  private updateUser(user) {
    this.user = typeof user === 'string' ? JSON.parse(user) : user;
    if (this.user.name) {
      const initials = this.user.name.match(/\b\w/g) || [];
      this.initials = (
        (initials.shift() || '') + (initials.pop() || '')
      ).toUpperCase();
    }
    this.eventEmitterService.invokeUserChange(this.user);
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else {
      return;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then((userData) => {
      this.apiService
        .getAuthToken(userData.authToken, socialPlatform)
        .subscribe((payload: any) => {
          this.cookie.set(
            'token',
            `${payload.success.token}`,
            this.expiredDate,
            '/'
          );

          localStorage.setItem('user', JSON.stringify(payload.user));
          this.updateUser(payload.user);
          this.matDialogUtils.closeDialogs();
        });
    });
  }

  openSignupDialog() {
    this.matDialogUtils.openSignupDialog(this.isHandset);
  }

  logout() {
    this.eventEmitterService.invokeUserTransition();
    this.apiService.signout().subscribe((payload: any) => {
      this.cookie.delete('token');
      localStorage.removeItem('user');
      this.checkIfGuestIsValid();
    });
  }

  isCurrentUserGuest(): boolean {
    return this.user.user_type === this.utils.userType.guest;
  }

  // creates guest user and copied data to regular user
  createGuestUser() {
    this.apiService.signup({ guest: 1 }).subscribe((payload: any) => {
      if (payload.success) {
        localStorage.setItem(
          this.attribute.lsGuestUser,
          JSON.stringify(payload.success.user)
        );
        localStorage.setItem(
          this.attribute.lsGuestUserToken,
          payload.success.token
        );

        localStorage.setItem(
          this.attribute.lsRegularUser,
          localStorage.getItem(this.attribute.lsGuestUser)
        );
        this.cookie.set(
          this.attribute.cookieUserRegularToken,
          localStorage.getItem(this.attribute.lsGuestUserToken),
          this.expiredDate,
          '/'
        );

        this.updateUser(localStorage.getItem(this.attribute.lsRegularUser));
      }
    });
  }

  checkIfGuestIsValid() {
    if (
      localStorage.getItem(this.attribute.lsGuestUser) &&
      localStorage.getItem(this.attribute.lsGuestUserToken)
    ) {
      localStorage.setItem(
        this.attribute.lsRegularUser,
        localStorage.getItem(this.attribute.lsGuestUser)
      );
      this.cookie.set(
        this.attribute.cookieUserRegularToken,
        localStorage.getItem(this.attribute.lsGuestUserToken),
        this.expiredDate,
        '/'
      );

      this.apiService.keepAlive().subscribe((payload: any) => {
        // guest profile is valid
        if (payload.alive) {
          this.updateUser(localStorage.getItem(this.attribute.lsGuestUser));
        } else {
          // guest profile is not valid
          this.createGuestUser();
        }
      });
    } else {
      this.createGuestUser();
    }
  }

  resolveUser() {
    // check if regular user exists
    if (
      localStorage.getItem(this.attribute.lsRegularUser) &&
      this.cookie.get(this.attribute.cookieUserRegularToken)
    ) {
      // check if the user session is valid
      this.apiService.keepAlive().subscribe((payload: any) => {
        // check if regular user profile is valid
        if (payload.alive) {
          this.updateUser(localStorage.getItem(this.attribute.lsRegularUser));
        } else {
          // check if guest profile is valid
          this.checkIfGuestIsValid();
        }
      });
    } else {
      this.checkIfGuestIsValid();
    }
  }
}
