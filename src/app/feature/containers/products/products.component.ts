import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  IProductPayload,
  IProductsPayload,
  IFilterData,
  ISortType
} from './../../../shared/models';
import { ApiService } from './../../../shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnInit, OnDestroy {
  productsSubscription: Subscription;
  products: IProductPayload[];
  productFilters: IFilterData;
  department: string;
  category: string;
  total_count: number = 0;
  filters = '';
  sortTypeList: ISortType[];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getParams();

    this.productsSubscription = this.apiService
      .getProducts(this.department, this.category)
      .subscribe((payload: IProductsPayload) => {
        this.products = payload.products;
        delete payload.filterData.category;
        this.productFilters = payload.filterData;
        this.sortTypeList = payload.sortType;
        this.total_count = payload.total;
      });
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  getParams(): void {
    const urlParams: string[] = this.router.url.split('/').slice(1);
    this.department = urlParams[1];
    this.category = urlParams[2];
  }

  onSetFilters(e): void {
    const filters = this.buildFilters(e);
    this.productsSubscription = this.apiService
      .getProducts(this.department, this.category, filters)
      .subscribe((payload: IProductsPayload) => {
        this.products = payload.products;
        this.total_count = payload.total;
        delete payload.filterData.category;
        this.productFilters = payload.filterData;
        this.sortTypeList = payload.sortType;
      });
  }

  buildFilters(event: string): string {
    let tempFilters = '';
    for (let [filter, options] of Object.entries(event)) {
      if (filter === 'price_from' || filter === 'price_to') {
        tempFilters += `${filter}:${options};`;
      } else {
        tempFilters += options.length ? `${filter}:${options};` : ``;
      }
    }
    return tempFilters;
  }
}
