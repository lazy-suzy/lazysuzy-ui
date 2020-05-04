import { Component } from '@angular/core';
import { ApiService, UtilsService } from './../../../shared/services';
import { Router, NavigationEnd } from '@angular/router';
import { IAllDepartment } from '../../../shared/models/all-department.interface';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-nav-mobile',
  templateUrl: './nav-mobile.component.html',
  styleUrls: ['./nav-mobile.component.less']
})
export class NavMobileComponent {
  logoPath: string = 'assets/images/color_logo_transparent.png';
  departments: IAllDepartment[];
  selectedIndex: number = null;
  menuVisible = false;
  mobileMenuContainer;
  showDepartment;
  showSearchComponent: boolean = false;
  notHome: Boolean;
  checkHomeRoute: Subscription;
  hideBar: boolean = false;

  constructor(
    private apiService: ApiService,
    private utils: UtilsService,
    private cookie: CookieService,
    private router: Router,
    private location: Location
  ) {
    this.getDepartments();
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.menuVisible = false;
      }
    });
    this.checkHomeRoute = router.events.subscribe(val => {
      this.notHome = location.path() !== '';
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      let orderRoute = this.router.url.slice(1, 6);
      if (this.router.url === '/payment' || orderRoute === 'order') {
        this.hideBar = true;
      } else {
        this.hideBar = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.checkHomeRoute.unsubscribe();
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

  getDepartments() {
    this.apiService.getAllDepartments().subscribe((payload: any) => {
      this.departments = payload.all_departments;
    });
  }

  showMenu() {
    this.menuVisible = !this.menuVisible;
  }

  showDepartmentChild(dept) {
    if (dept === this.showDepartment) {
      this.showDepartment = undefined;
      return;
    }
    this.showDepartment = dept;
  }

  showSearchBar() {
    this.showSearchComponent = !this.showSearchComponent;
  }

  onSearchComplete(e) {
    this.showSearchComponent = false;
  }

  isLoggedIn(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.cookie.get('token')) {
      this.router.navigateByUrl('/wishlist');
    } else {
      this.utils.openSignupDialog(true);
    }
  }
}
