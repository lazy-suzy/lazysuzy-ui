import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver,
} from '@angular/cdk/layout';

import { Router, NavigationStart } from '@angular/router';
import { boardRoutesNames } from './modules/board/board.routes.names';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from './shared/services/api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'LazySuzy';

  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  tabletObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Tablet
  );

  bpSubscription: Subscription;
  tabletSubscription: Subscription;
  isHandset: boolean;
  isTablet: boolean = false;
  isMinimalMode = false;
  isLoggedIn = false;
  expiredDate = new Date();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private apiService: ApiService,
    private cookie: CookieService
  ) {
    router.events.subscribe((navigation) => {
      if (
        navigation instanceof NavigationStart &&
        navigation.url.match(`/${boardRoutesNames.BOARD_EMBED}/`)
      )
        this.isMinimalMode = true;
    });
    this.expiredDate.setMonth(this.expiredDate.getMonth() + 6);
  }

  ngOnInit(): void {
    this.initializeUserSession();
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    this.tabletSubscription = this.tabletObserver.subscribe(
      (tablet: BreakpointState) => {
        this.isTablet = tablet.matches;
      }
    );
  }

  ngOnDestroy(): void {
    this.bpSubscription.unsubscribe();
  }
  async initializeUserSession() {

    const attribute = {
      postGuestKey: 'guest',
      lsGuestUser: 'guest-user',
      lsGuestUserToken: 'guest-token',
      lsRegularUser: 'user',
      cookieUserRegularToken: 'token'
    };
    
    let guestUserCreated = false;

    if (!localStorage.getItem(attribute.lsGuestUser) || !localStorage.getItem(attribute.lsGuestUserToken)){
      let skipGuestUserCreation = false;

      // this "IF BLOCK" is temporary code block to handle cases where there is some data for user
      if (localStorage.getItem(attribute.lsRegularUser) && this.cookie.get(attribute.cookieUserRegularToken)){
        let currentUser = JSON.parse(localStorage.getItem(attribute.lsRegularUser));
        // the current user is already a guest so copy the data
        if (currentUser.email == ""){
          skipGuestUserCreation = true;
          localStorage.setItem(attribute.lsGuestUser, localStorage.getItem(attribute.lsRegularUser));
          localStorage.setItem(attribute.lsGuestUserToken, this.cookie.get(attribute.cookieUserRegularToken));
        }
      }

      if (!skipGuestUserCreation) {
        const payload: any = await this.apiService.signup({
          guest: 1
        }).toPromise();
        if (payload.success) {
          guestUserCreated = true;
          localStorage.setItem(attribute.lsGuestUser, JSON.stringify(payload.success.user));
          localStorage.setItem(attribute.lsGuestUserToken, payload.success.token);
        }
      }
    }

    if (!localStorage.getItem(attribute.lsRegularUser) || !this.cookie.get(attribute.cookieUserRegularToken) || guestUserCreated) {
      localStorage.setItem(attribute.lsRegularUser, localStorage.getItem(attribute.lsGuestUser));
      this.cookie.set(attribute.cookieUserRegularToken, localStorage.getItem(attribute.lsGuestUserToken), this.expiredDate, '/');
    }

    this.isLoggedIn = true;

  }
}
