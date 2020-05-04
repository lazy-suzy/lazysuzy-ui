import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
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
  hideBar: boolean = false;
  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {}

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
    this.router.events.subscribe((res) => { 
      if (this.router.url === '/payment') {
        this.hideBar = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.bpSubscription.unsubscribe();
  }
}
