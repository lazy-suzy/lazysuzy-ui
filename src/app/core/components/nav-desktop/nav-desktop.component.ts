import { Component } from '@angular/core';
import { MOCK_ACCOUNT_ACTIONS, MOCK_DEPARTMENTS } from './../../../mocks';
import { ICategory, IDepartment } from './../../../shared/models';

@Component({
  selector: 'app-nav-desktop',
  templateUrl: './nav-desktop.component.html',
  styleUrls: ['./nav-desktop.component.less'],
})

export class NavDesktopComponent {
  logoPath: string = 'assets/images/color_logo_transparent.png';
  departments: IDepartment[] = MOCK_DEPARTMENTS;
  accountActions: ICategory[] = MOCK_ACCOUNT_ACTIONS;
}
