import { Component, OnInit } from '@angular/core';
import { MOCK_NAV_CATEGORIES } from './../../../mocks';
import { INavCategory } from './../../../shared/models';

@Component({
  selector: 'app-nav-desktop',
  templateUrl: './nav-desktop.component.html',
  styleUrls: ['./nav-desktop.component.less'],
})
export class NavDesktopComponent implements OnInit {
  categories: INavCategory[] = MOCK_NAV_CATEGORIES;
  ngOnInit() {}
}
