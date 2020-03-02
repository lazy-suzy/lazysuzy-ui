import { Component } from '@angular/core';
import { MOCK_ACCOUNT_ACTIONS, MOCK_DEPARTMENTS } from 'src/app/mocks';
import { ICategory, IDepartment } from 'src/app/shared/models';

@Component({
  selector: 'app-nav-mobile',
  templateUrl: './nav-mobile.component.html',
  styleUrls: ['./nav-mobile.component.less'],
})
export class NavMobileComponent {
  logoPath: string = 'assets/images/color_logo_transparent.png';
  departments: IDepartment[] = MOCK_DEPARTMENTS;
  accountActions: ICategory[] = MOCK_ACCOUNT_ACTIONS;
}
