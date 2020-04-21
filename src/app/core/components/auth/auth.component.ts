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
  EventEmitterService
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
  closeSignupModal: ElementRef;
  @ViewChild('signupBtn', { static: false }) signupBtn: ElementRef;

  @Input() isHandset: boolean;
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
    private utils: UtilsService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.fetchUser();

    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeFetchUser.subscribe(
        payload => {
          this.cookie.set('token', `${payload.token}`);
          localStorage.setItem('user', JSON.stringify(payload.user));
          this.fetchUser();
        }
      );
      this.eventEmitterService.socialSubs = this.eventEmitterService.invokeSocialLogin.subscribe(
        platform => {
          debugger;
          this.socialSignIn(platform);
        }
      );
    }
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

    this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
      console.log(userData);
      this.apiService
        .getAuthToken(userData.authToken, socialPlatform)
        .subscribe((payload: any) => {
          this.cookie.set('token', `${payload.access_token}`);
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
    this.utils.openSignupDialog(this.isHandset ? '80%' : '35%');
  }

  logout() {
    this.cookie.set('token', '');
    localStorage.removeItem('user');
    this.fetchUser();
  }
}
