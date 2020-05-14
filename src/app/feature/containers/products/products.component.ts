import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
} from '@angular/core';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import {
  IProductPayload,
  IProductsPayload,
  IFilterData,
  ISortType,
} from './../../../shared/models';
import { MatDialog } from '@angular/material/dialog';
import {
  ApiService,
  UtilsService,
  CacheService,
} from './../../../shared/services';
import { SCROLL_ICON_SHOW_DURATION } from './../../../shared/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver,
} from '@angular/cdk/layout';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  productsSubscription: Subscription;
  routeSubscription: Subscription;
  products: IProductPayload[];
  productFilters: IFilterData = {
    brand: [],
    type: [],
    color: [],
    category: [],
    price: { from: 0, min: 0, max: 0, to: 0 },
  };
  department: string;
  category: string;
  categoryTitle: string;
  emailTitle: string;
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
  spinner: string = 'assets/image/spinner.gif';
  showMobileFilter: boolean = false;
  showMobileSort: boolean = false;
  productsInRow: number = 2;
  modalSku: string = '';
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  bpSubscription: Subscription;
  isHandset: boolean;
  scrollToProductSKU: string = '';

  constructor(
    public dialog: MatDialog,
    private productElement: ElementRef,
    private apiService: ApiService,
    private router: Router,
    private location: Location,
    private activeRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private utilsService: UtilsService,
    public cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.getParamsFromQuery();
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    this.routeSubscription = this.activeRoute.params.subscribe(
      (routeParams) => {
        this.department = routeParams.department;
        this.category = routeParams.category;
        this.checkPage();
      }
    );
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
    this.activeRoute.queryParams.subscribe((params) => {
      this.filters = params['filters'] || '';
      this.pageNo = parseInt(params['pageNo']) || 0;
      this.sortType = params['sortType'] || '';
    });
  }

  checkPage() {
    if (this.pageNo > 0) {
      this.isProductFetching = true;
      this.productsSubscription = this.apiService
        .getMultiplePageProducts(
          this.department,
          this.category,
          this.filters,
          this.sortType,
          this.pageNo
        )
        .subscribe((response) => {
          let allProducts = [];
          for (let i = 0; i < response.length; i++) {
            allProducts = [...allProducts, ...response[i].products];
          }
          this.categoryTitle = response[0].seo_data.page_title;
          this.emailTitle = response[0].seo_data.email_title;
          this.products = allProducts;
          this.updateQueryString();
          this.total_count = response[0].total;
          delete response[0].filterData.category;
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
      .getProducts(this.department, this.category, this.filters, this.sortType)
      .subscribe((payload: IProductsPayload) => {
        this.categoryTitle = payload.seo_data.page_title;
        this.emailTitle = payload.seo_data.email_title;
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
    let params = new HttpParams();
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
      setTimeout(function () {
        _self.isIconShow = false;
      }, SCROLL_ICON_SHOW_DURATION);
    }
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
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
