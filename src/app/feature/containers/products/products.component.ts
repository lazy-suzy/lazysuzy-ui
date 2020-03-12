import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import {
  IProductPayload,
  IProductsPayload,
  IFilterData,
  ISortType
} from './../../../shared/models';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from './../../components';
import { ApiService, UtilsService } from './../../../shared/services';
import { SCROLL_ICON_SHOW_DURATION } from './../../../shared/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';

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
  fixFilterBar = 150;
  isIconShow: boolean = false;
  showBar: boolean = false;
  isProductFetching: boolean = false;
  spinner: string = 'assets/images/spinner.gif';
  showMobileFilter: boolean = false;
  showMobileSort: boolean = false;
  productsInRow: number = 2;
  modalSku: string = '';
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  checkProductsLength: number = 1;
  bpSubscription: Subscription;
  isHandset: boolean;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private router: Router,
    private location: Location,
    private activeRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.getParamsFromQuery();
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    this.routeSubscription = this.activeRoute.params.subscribe(routeParams => {
      this.department = routeParams.department;
      this.category = routeParams.category;
      this.loadProducts();
    });
    this.loadProducts();
    this.modalSku = this.activeRoute.snapshot.queryParamMap.get('modal_sku');
    if (this.modalSku) {
      this.utilsService.openMatDialog(this.modalSku);
    }
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.bpSubscription.unsubscribe();
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
        this.checkProductsLength = payload.products.length;
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
      .getProducts(
        this.department,
        this.category,
        this.filters,
        this.sortType,
        this.pageNo
      )
      .subscribe((payload: IProductsPayload) => {
        this.products = [...this.products, ...payload.products];
        this.checkProductsLength = payload.products.length;
        this.updateQueryString();
        this.isProductFetching = false;
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
    this.showBar = scrollPosition >= this.fixFilterBar;
    const _self = this;
    if (this.isIconShow) {
      setTimeout(function() {
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
