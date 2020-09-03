import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../admin-dashboard.service';
import { IFilterData, ISortType } from 'src/app/shared/models';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-product-customise',
  templateUrl: './product-customise.component.html',
  styleUrls: ['./product-customise.component.less']
})
export class ProductCustomiseComponent implements OnInit {
  productsSubscription: Subscription;
  isProductFetching = false;
  total = 24;
  filters = '';
  sortType = '';
  productFilters: IFilterData;
  trend: string;
  category: string;
  totalCount = 0;
  pageNo = 0;
  sortTypeList: ISortType[];
  products = [];
  positions = [
    { value: '0', viewValue: '0' },
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' }
  ];
  allBoards = [
    { value: 'primary', viewValue: 'B1' },
    { value: 'secondary', viewValue: 'B2' }
  ];
  spinner = 'assets/image/spinner.gif';

  constructor(private adminDashboardService: AdminDashboardService) {}

  ngOnInit() {
    this.loadProducts();
  }

  tagImage(data) {
    this.adminDashboardService.tagImage(data).subscribe(() => {});
  }

  onSetFilters(e): void {
    this.filters = e;
    this.loadProducts();
  }

  onSetSortType(e): void {
    this.sortType = e;
    this.loadProducts();
  }

  loadProducts(): void {
    this.isProductFetching = true;
    this.pageNo = 0;
    this.productsSubscription = this.adminDashboardService
      .getProducts(this.total, this.filters, this.sortType, this.pageNo)
      .subscribe((payload) => {
        this.products = payload.products;
        this.productFilters = payload.filterData;
        this.sortTypeList = payload.sortType;
        this.totalCount = payload.total;
        this.isProductFetching = false;
      });
  }

  onScroll() {
    if (this.isProductFetching) {
      return;
    }
    this.pageNo += 1;
    this.isProductFetching = true;

    this.productsSubscription = this.adminDashboardService
      .getProducts(this.total, this.filters, this.sortType, this.pageNo)
      .subscribe((payload) => {
        this.products = [...this.products, ...payload.products];
        this.productFilters = payload.filterData;
        this.sortTypeList = payload.sortType;
        this.totalCount = payload.total;
        this.isProductFetching = false;
      });
  }

  onDestroy(): void {
    this.productsSubscription.unsubscribe();
  }
}
