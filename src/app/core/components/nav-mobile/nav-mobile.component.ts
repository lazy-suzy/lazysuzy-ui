import { Component } from '@angular/core';
import { MOCK_ACCOUNT_ACTIONS, MOCK_DEPARTMENTS } from 'src/app/mocks';
import { ApiService } from './../../../shared/services';
import { Router, NavigationEnd} from '@angular/router';
import { IAllDepartment } from '../../../shared/models/all-department.interface';

@Component({
  selector: 'app-nav-mobile',
  templateUrl: './nav-mobile.component.html',
  styleUrls: ['./nav-mobile.component.less'],
})
export class NavMobileComponent {
  logoPath: string = 'assets/images/color_logo_transparent.png';
  departments: IAllDepartment[];
  selectedIndex: number = null;
  menuVisible = false;
  mobileMenuContainer;
  showDepartment;
  showSearchComponent: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {
    this.getDepartments();
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.menuVisible = false;
      }
     });
  }

  setIndex(index: number) {
      this.selectedIndex = index;
  }

  getDepartments() {
    this.apiService.getAllDepartments()
    .subscribe((payload: any) => {
      this.departments = payload.all_departments;
    });
  }

  showMenu() {
    this.menuVisible = !this.menuVisible;
  }

  showDepartmentChild(dept) {
    if(dept === this.showDepartment) {
      this.showDepartment = undefined;
      return;
    }
    this.showDepartment = dept;
  }

  showSearchBar() {
    this.showSearchComponent = !this.showSearchComponent;
  }
}
