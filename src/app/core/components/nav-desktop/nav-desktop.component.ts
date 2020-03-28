import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { IAllDepartment } from '../../../shared/models';
import { ApiService, UtilsService } from './../../../shared/services';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-nav-desktop',
  templateUrl: './nav-desktop.component.html',
  styleUrls: ['./nav-desktop.component.less']
})
export class NavDesktopComponent {
  @Input() isTablet: boolean;
  logoPath: string = 'assets/images/color_logo_transparent.png';
  departments: IAllDepartment[];
  notHome: Boolean;
  checkHomeRoute: Subscription;
  email: any;
  password: any;
  constructor(
    private router: Router,
    private location: Location,
    private utils: UtilsService,
    private apiService: ApiService,
    private messageService: MessageService,
    private cookie: CookieService
  ) {
    this.checkHomeRoute = router.events.subscribe(val => {
      this.notHome = location.path() !== '';
    });
    this.getDepartments();
  }

  ngOnDestroy(): void {
    this.checkHomeRoute.unsubscribe();
  }

  ngOnInit(): void {}

  login() {
    const user = {
      email: this.email,
      password: this.password
    };
    if (user.email && user.password) {
      this.apiService.login(user).subscribe(res => {
        if (res['data']) {
          // this.apiService.storeUserData(res["token"]);
          // localStorage.setItem("admin_id", res["data"]["id"]);
          // localStorage.setItem("role", res["data"]["role"]);
          // this.router.navigate(["admin"]);
          this.messageService.add({
            severity: 'success',
            summary: 'Success Message',
            detail: 'User logged in'
          });
        }
      });
      // .catch(err => {
      //   this.messageService.add({
      //     severity: "error",
      //     summary: " Error Message",
      //     detail: "Invalid Email or Password"
      //   });
      // });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: ' Error Message',
        detail: 'Please Enter Email and Password'
      });
    }
  }

  isLoggedIn(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.cookie.get('token')) {
      this.router.navigateByUrl('/wishlist');
    } else {
      this.utils.openSignup();
    }
  }

  getDepartments() {
    this.apiService.getAllDepartments().subscribe((payload: any) => {
      this.departments = payload.all_departments;
    });
  }
}
