import { Component, OnInit } from '@angular/core';
import { MOCK_ACCOUNT_ACTIONS, MOCK_NAV_CATEGORIES } from './../../../mocks';
import { IMenuItem, INavCategory } from './../../../shared/models';

@Component({
  selector: 'app-nav-desktop',
  templateUrl: './nav-desktop.component.html',
  styleUrls: ['./nav-desktop.component.less'],
})
export class NavDesktopComponent implements OnInit {
  logoPath: string = 'assets/images/dark_logo_transparent.png';
  categories: INavCategory[] = MOCK_NAV_CATEGORIES;
  accountActions: IMenuItem[] = MOCK_ACCOUNT_ACTIONS;
  ngOnInit() {}
}
