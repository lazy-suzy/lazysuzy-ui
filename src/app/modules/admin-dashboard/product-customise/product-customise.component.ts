import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../admin-dashboard.service';
import { IFilterData, ISortType } from 'src/app/shared/models';

@Component({
  selector: 'app-product-customise',
  templateUrl: './product-customise.component.html',
  styleUrls: ['./product-customise.component.less'],
})
export class ProductCustomiseComponent implements OnInit {
  isProductFetching: boolean = false;
  total: number = 24;
  filters: string = '';
  sortType: string = '';
  productFilters: IFilterData;
  trend: string;
  category: string;
  total_count: number = 0;
  sortTypeList: ISortType[];
  products = [];
  positions = [
    { value: '0', viewValue: '0' },
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
  ];
  allBoards = [
    { value: 'primary', viewValue: 'B1' },
    { value: 'secondary', viewValue: 'B2' },
  ];

  constructor(private adminDashboardService: AdminDashboardService) {}

  ngOnInit() {
    this.adminDashboardService
      .getProducts(this.total, this.filters, this.sortType)
      .subscribe((payload) => {
        this.products = payload.products;
        this.productFilters = payload.filterData;
        this.sortTypeList = payload.sortType;
        this.total_count = payload.total;
        this.isProductFetching = false;
      });
  }
  onScroll() {}

  tagImage(data) {
    this.adminDashboardService.tagImage(data).subscribe(() => {});
  }
}
