import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  IProductPayload,
  IProductsPayload,
  IFilterData,
  ISortType
} from './../../../shared/models';
import { ApiService } from './../../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnInit, OnDestroy {
  productsSubscription: Subscription;
  routeSubscription: Subscription;
  products: IProductPayload[];
  productFilters: IFilterData;
  department: string;
  category: string;
  total_count: number = 0;
  filters = '';
  sortType = '';
  sortTypeList: ISortType[];
  pageNo: number = 0;
  topPosToStartShowing = 300;
  isIconShow: boolean = false;
  isProductFetching: boolean = false;
  spinner: string = 'assets/images/spinner.gif';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.getParamsFromQuery();
    this.routeSubscription = this.activeRoute.params.subscribe(routeParams => {
      this.department = routeParams.department;
      this.category = routeParams.category;
      this.loadProducts();
    });
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  getParams(): void {
    const urlParams: string[] = this.router.url.split('/').slice(1);
    this.department = urlParams[1];
    this.category = urlParams[2].split('?')[1];
  }
  getParamsFromQuery(): void {
    this.activeRoute.queryParams.subscribe(params => {
      this.filters = params['filters'] || '';
      this.pageNo = parseInt(params['pageNo']) || 0;
      this.sortType = params['sortType'] || '';
    });
  }

  loadProducts(): void {
    this.pageNo = 0;
    this.isProductFetching = true;
    this.productsSubscription = this.apiService
      .getProducts(this.department, this.category, this.filters, this.sortType)
      .subscribe((payload: IProductsPayload) => {
        this.products = payload.products;
        delete payload.filterData.category;
        this.productFilters = payload.filterData;
        this.sortTypeList = payload.sortType;
        this.total_count = payload.total;
        this.updateQueryString();
        this.isProductFetching = false;
      });
  }

  updateQueryString(): void {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        filters: this.filters,
        sortType: this.sortType,
        pageNo: this.pageNo
      },
      queryParamsHandling: 'merge' // remove to replace all query params by provided
    });
  }

  onSetFilters(e): void {
    this.filters = this.buildFilters(e);
    this.loadProducts();
  }

  onSetSortType(e): void {
    this.sortType = e;
    this.loadProducts();
  }

  onScroll() {
    this.pageNo += 1;
    this.isProductFetching = true;

    this.productsSubscription = this.apiService
      .getProducts(
        this.department,
        this.category,
        this.filters,
        this.sortType,
        this.pageNo
      )
      .subscribe((payload: IProductsPayload) => {
        this.products = [...this.products, ...payload.products];
        this.isProductFetching = false;
        this.updateQueryString();
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
  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isIconShow = scrollPosition >= this.topPosToStartShowing;
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
