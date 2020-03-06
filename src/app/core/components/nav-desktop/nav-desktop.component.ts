import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { IAllDepartment } from '../../../shared/models';
import { ApiService } from './../../../shared/services';

@Component({
  selector: 'app-nav-desktop',
  templateUrl: './nav-desktop.component.html',
  styleUrls: ['./nav-desktop.component.less']
})
export class NavDesktopComponent {
  logoPath: string = 'assets/images/color_logo_transparent.png';
  departments: IAllDepartment[];
  notHome: Boolean;
  checkHomeRoute: Subscription;

  constructor(
    private router: Router,
    private location: Location,
    private apiService: ApiService
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

  getDepartments() {
    this.apiService.getAllDepartments().subscribe((payload: any) => {
      this.departments = payload.all_departments;
    });
  }
}
