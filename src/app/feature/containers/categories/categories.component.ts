import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAllCategory } from '../../../shared/models/all-department.interface';
import { ApiService } from './../../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.less']
})
export class CategoriesComponent implements OnInit {
  routeSubscription: Subscription;
  categorySubscription: Subscription;
  department: string;
  categories: IAllCategory[];
  constructor(
    private apiService: ApiService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.routeSubscription = this.activeRoute.params.subscribe(routeParams => {
      this.department = routeParams.department;
      this.getCategories();
    });
    this.getCategories();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.categorySubscription.unsubscribe();
  }

  getParams(): void {
    const urlParams: string[] = this.router.url.split('/').slice(1);
    this.department = urlParams[1];
  }

  getCategories() {
    this.categorySubscription = this.apiService
      .getCategories(this.department)
      .subscribe((payload: any) => {
        this.categories = payload.categories;
      });
  }
}
