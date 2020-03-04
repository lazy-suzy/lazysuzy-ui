import { Component } from '@angular/core';
import { MOCK_ACCOUNT_ACTIONS, MOCK_DEPARTMENTS } from './../../../mocks';
import { ICategory, IDepartment } from './../../../shared/models';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-desktop',
  templateUrl: './nav-desktop.component.html',
  styleUrls: ['./nav-desktop.component.less']
})
export class NavDesktopComponent {
  logoPath: string = 'assets/images/color_logo_transparent.png';
  departments: IDepartment[] = MOCK_DEPARTMENTS;
  accountActions: ICategory[] = MOCK_ACCOUNT_ACTIONS;
  presentRoute: string;
  notHome: Boolean;
  checkHomeRoute: Subscription;
  constructor(private router: Router, private location: Location) {
    this.checkHomeRoute = router.events.subscribe(val => {
      this.notHome = location.path() !== '';
    });
  }

  ngOnDestroy(): void {
    this.checkHomeRoute.unsubscribe();
  }

  ngOnInit(): void {}
}
