import {Component, HostListener, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {
    BreakpointState,
    Breakpoints,
    BreakpointObserver
} from '@angular/cdk/layout';
import {Location} from '@angular/common';

import {Router, NavigationStart} from '@angular/router';
import {boardRoutesNames} from './modules/board/board.routes.names';
import {CookieService} from 'ngx-cookie-service';
import {ApiService} from './shared/services/api/api.service';
import {environment} from '../environments/environment';

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
    showNavbar = true;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private router: Router,
        private apiService: ApiService,
        private cookie: CookieService,
        private location: Location,
    ) {
        router.events.subscribe((navigation) => {
            if (
                navigation instanceof NavigationStart &&
                navigation.url.match(`/${boardRoutesNames.BOARD_EMBED}/`)
            ) {
                this.isMinimalMode = true;
            }
            const url = new RegExp(`${environment.SITE_URL.replace('http://', '')}($|\\/$|\\/\\?)`, 'gm');

            this.showNavbar = !location.path();
        });
    }

    @HostListener('window:scroll')
    onWindowScroll() {
        // In chrome and some browser scroll is given to body tag
        const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
        const max = document.documentElement.scrollHeight - 100;
        // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
        const intercom = document.getElementsByClassName('intercom-lightweight-app')[0];
        if (pos >= max && intercom) {
            intercom.classList.add('hidden');
        } else if (intercom) {
            intercom.classList.remove('hidden');
        }
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
