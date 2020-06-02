import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import {
  IProductPayload,
  IProductsPayload,
  IFilterData,
  ISortType
} from './../../../shared/models';
import {
  ApiService,
  CacheService,
  EventEmitterService
} from './../../../shared/services';
import { SCROLL_ICON_SHOW_DURATION } from './../../../shared/constants';
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
  spinner = 'assets/image/spinner.gif';
  showMobileFilter = false;
  showMobileSort = false;
  productsInRow = 2;
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );

  bpSubscription: Subscription;
  isHandset: boolean = false;
  total: number = 24;
  scrollToProductSKU: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private location: Location,
    private activeRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    public cacheService: CacheService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.getParamsFromQuery();
        this.bpSubscription = this.bpObserver.subscribe(
          (handset: BreakpointState) => {
            this.isHandset = handset.matches;
          }
        );
      });
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.bpSubscription.unsubscribe();
  }

  getParamsFromQuery(): void {
    this.routeSubscription = this.activeRoute.queryParams.subscribe(
      (params) => {
        this.filters = params.filters || '';
        this.pageNo = parseInt(params.pageNo) || 0;
        this.sortType = params.sortType || '';
        Object.keys(params).map((key) => {
          if (key === 'new' || key === 'bestseller' || key === 'sale') {
            this.trend = key;
          }
        });
        this.checkPage();
      }
    );
  }
  checkPage() {
    if (this.pageNo > 0) {
      this.isProductFetching = true;
      this.productsSubscription = this.apiService
        .getMultiplePageAllProducts(
          this.trend,
          this.total,
          this.filters,
          this.sortType,
          this.pageNo
        )
        .subscribe((response) => {
          let allProducts = [];
          for (let i = 0; i < response.length; i++) {
            allProducts = [...allProducts, ...response[i].products];
          }
          this.products = allProducts;
          this.updateQueryString();
          this.total_count = response[0].total;
          this.productFilters = response[0].filterData;
          this.sortTypeList = response[0].sortType;
          this.isProductFetching = false;
          if (this.cacheService.data.useCache) {
            this.scrollToProductSKU = this.cacheService.data.productSku;
            this.cacheService.data.useCache = false;
            setTimeout(() => {
              // this.productElement.nativeElement.getElementById
              let el = document.getElementById(this.scrollToProductSKU);
              window.scrollTo(0, el.offsetTop - 200);
            }, 500);
          }
        });
    } else {
      this.loadProducts();
    }

    //Code for cached product sku
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
    let params = new HttpParams();
    params = params.set(this.trend, 'true');
    params = params.set('filters', this.filters);
    params = params.set('sortType', this.sortType);
    params = params.set('pageNo', this.pageNo.toString());

    this.location.replaceState(
      window.location.pathname,
      params.toString(),
      this.location.getState()
    );
  }

  onSetFilters(e): void {
    this.filters = e;
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

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isIconShow = scrollPosition >= this.topPosToStartShowing;
    this.showBar = scrollPosition >= this.fixFilterBar;
    const _self = this;
    if (this.isIconShow) {
      setTimeout(function () {
        _self.isIconShow = false;
      }, SCROLL_ICON_SHOW_DURATION);
    }
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
