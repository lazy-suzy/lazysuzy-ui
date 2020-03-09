import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import {
  IProductPayload,
  IProductsPayload,
  IFilterData,
  ISortType
} from './../../../shared/models';
import { ApiService } from './../../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.less']
})
export class AllProductsComponent implements OnInit {
  productsSubscription: Subscription;
  routeSubscription: Subscription;
  products: IProductPayload[];
  productFilters: IFilterData;
  trend: string;
  category: string;
  total_count = 0;
  filters = '';
  sortType = '';
  sortTypeList: ISortType[];
  pageNo = 0;
  topPosToStartShowing = 300;
  fixFilterBar = 150;
  isIconShow = false;
  showBar = false;
  isProductFetching = false;
  spinner = 'assets/images/spinner.gif';
  showMobileFilter = false;
  showMobileSort = false;
  productsInRow = 2;
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );

  bpSubscription: Subscription;
  isHandset: boolean = false;
  total: number = 24;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.getParamsFromQuery();
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.bpSubscription.unsubscribe();
  }

  getParamsFromQuery(): void {
    this.routeSubscription = this.activeRoute.queryParams.subscribe(params => {
      this.filters = params.filters || '';
      this.pageNo = parseInt(params.pageNo) || 0;
      this.sortType = params.sortType || '';
      Object.keys(params).map(key => {
        if (key === 'new' || key === 'bestseller' || key === 'sale') {
          this.trend = key;
        }
      });
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.pageNo = 0;
    this.isProductFetching = true;
    this.productsSubscription = this.apiService
      .getAllProducts(this.trend, this.total, this.filters, this.sortType)
      .subscribe((payload: IProductsPayload) => {
        this.products = payload.products;
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
        pageNo: this.pageNo,
        [this.trend]: true
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

  onSetMobileToggle($e): void {
    this.toggleMobileFilter();
  }

  onSetSortToggle($e): void {
    this.toggleMobileSort();
  }

  onScroll() {
    if (this.isProductFetching) {
      return;
    }
    this.pageNo += 1;
    this.isProductFetching = true;

    this.productsSubscription = this.apiService
      .getAllProducts(
        this.trend,
        this.total,
        this.filters,
        this.sortType,
        this.pageNo
      )
      .subscribe((payload: IProductsPayload) => {
        this.products = [...this.products, ...payload.products];
        this.updateQueryString();
        this.isProductFetching = false;
      });
  }

  buildFilters(event: string): string {
    let tempFilters = '';
    for (const [filter, options] of Object.entries(event)) {
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
    this.showBar = scrollPosition >= this.fixFilterBar;
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  toggleMobileFilter() {
    this.showMobileFilter = !this.showMobileFilter;
  }

  toggleMobileSort() {
    this.showMobileSort = !this.showMobileSort;
  }

  toggleMobileView() {
    if (this.productsInRow === 3) {
      this.productsInRow = 1;
    } else {
      this.productsInRow += 1;
    }
  }
}
