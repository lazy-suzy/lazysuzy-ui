import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';

import { Router, NavigationStart } from '@angular/router';
import { boardRoutesNames } from './modules/board/board.routes.names';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from './shared/services/api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
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
  isTablet = false;
  isMinimalMode = false;

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
      ) {
        this.isMinimalMode = true;
      }
    });
  }

  ngOnInit(): void {
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

  onDestroy(): void {
    this.bpSubscription.unsubscribe();
  }
}
