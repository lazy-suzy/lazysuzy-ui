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
    this.createGuestUserIfRequired();
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
  async createGuestUserIfRequired() {
    // no trace of user
    if (!this.cookie.get('token') && !localStorage.getItem('user')) {
      var formData: any = new FormData();
      formData.append('guest', 1);
      const payload: any = await this.apiService.signup(formData).toPromise();
      if (payload.success) {
        this.cookie.set('token', payload.success.token, this.expiredDate, '/');
        localStorage.setItem('user', JSON.stringify(payload.success.user));
        this.isLoggedIn = true;
      }
    } else {
      this.isLoggedIn = true;
    }
  }
}
