import { Component, OnInit } from '@angular/core';
import {
  ApiService,
  UtilsService,
  MatDialogUtilsService
} from './../../../shared/services';
import { Router, NavigationEnd } from '@angular/router';
import { IAllDepartment } from '../../../shared/models/all-department.interface';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { EventEmitterService } from 'src/app/shared/services';
@Component({
  selector: 'app-nav-mobile',
  templateUrl: './nav-mobile.component.html',
  styleUrls: ['./nav-mobile.component.less']
})
export class NavMobileComponent implements OnInit {
  logoPath = 'assets/image/color_logo_transparent.png';
  departments: IAllDepartment[];
  selectedIndex = null;
  menuVisible = false;
  mobileMenuContainer;
  showDepartment;
  showSearchComponent = false;
  notHome: boolean;
  checkHomeRoute: Subscription;
  hideBar = false;
  eventSubscription: Subscription;
  cartProduct: number;

  constructor(
    private apiService: ApiService,
    private utils: UtilsService,
    private cookie: CookieService,
    private router: Router,
    private location: Location,
    private eventEmitterService: EventEmitterService,
    private matDialogUtils: MatDialogUtilsService
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.menuVisible = false;
      }
    });
    this.checkHomeRoute = router.events.subscribe((val) => {
      // this.notHome = location.path() !== '';
      this.notHome =
        location.path() !== '' && location.path().match(/board/) == null;
    });
  }

  ngOnInit(): void {
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.eventEmitterService.updateCart.subscribe((payload) => {
          // tslint:disable-next-line: radix
          this.cartProduct = parseInt(localStorage.getItem('cart'));
        });
        // tslint:disable-next-line: radix
        this.cartProduct = parseInt(localStorage.getItem('cart'));
        this.getDepartments();
        this.router.events.subscribe((res) => {
          const orderRoute = this.router.url.slice(1, 6);
          if (this.router.url === '/checkout' || orderRoute === 'order') {
            this.hideBar = true;
          } else {
            this.hideBar = false;
          }
        });
      });
  }

  onDestroy(): void {
    this.checkHomeRoute.unsubscribe();
    this.eventSubscription.unsubscribe();
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

    const localData = JSON.parse(localStorage.getItem('user') || '{}');
    if (localData.email.length > 0) {
      this.router.navigateByUrl('/wishlist');
    } else {
      this.matDialogUtils.openSignupDialog(true);
    }
  }
}
