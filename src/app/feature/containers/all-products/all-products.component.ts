import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {HttpParams} from '@angular/common/http';
import {IFilterData, IProductPayload, IProductsPayload, ISortType} from './../../../shared/models';
import {ApiService, CacheService, EventEmitterService, SeoService} from './../../../shared/services';
import {SCROLL_ICON_SHOW_DURATION} from './../../../shared/constants';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {Title} from '@angular/platform-browser';
import {first} from 'rxjs/operators';
import MetaData from '../../../shared/services/seo/meta-data-model';

@Component({
    selector: 'app-all-products',
    templateUrl: './all-products.component.html',
    styleUrls: ['./all-products.component.less']
})
export class AllProductsComponent implements OnInit {
    @ViewChild('productFiltersComponent', {static: true}) productFilter: any;
    productsSubscription: Subscription;
    isBrandPageSubscription: Subscription;
    routeSubscription: Subscription;
    products: IProductPayload[];
    productFilters: IFilterData;
    trend: string;
    category: string;
    totalCount = 0;
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
    timeout: any;
    bpSubscription: Subscription;
    isHandset = false;
    total = 24;
    scrollToProductSKU = '';
    eventSubscription: Subscription;
    brandData: any = {
        cover_image: '',
        description: '',
        logo: '',
        name: '',
        url: '',
        value: ''
    };
    selectedBrandValue: string = '';
    isBrandPage: boolean = false;
    isChangingBrandList: boolean = false;
    collectionsList: any;
    showFilters = false;

    constructor(
        private apiService: ApiService,
        private router: Router,
        private location: Location,
        private activeRoute: ActivatedRoute,
        private breakpointObserver: BreakpointObserver,
        public cacheService: CacheService,
        private eventEmitterService: EventEmitterService,
        private title: Title,
        private seoService: SeoService
    ) {
        this.isBrandPageSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const url = event.urlAfterRedirects;
                const checkBrandPage = url.indexOf('/products/brand');
                if (checkBrandPage > -1) {
                    this.isBrandPage = true;
                }
                // console.log('this is isBrandPage: ', this.isBrandPage);
            }
        });
        this.apiService.getCollections().pipe(first()).subscribe(collections => {
            this.collectionsList = collections;
        });
    }

    toggleFilterBar() {
        this.showFilters = !this.showFilters;
    }

    ngOnInit(): void {
        this.eventSubscription = this.eventEmitterService.userChangeEvent
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

    clearFilters() {
        this.productFilter.clearFilters();
    }

    onDestroy(): void {
        this.productsSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
        this.bpSubscription.unsubscribe();
        this.eventSubscription.unsubscribe();
        this.isBrandPageSubscription.unsubscribe();
    }

    getParamsFromQuery(): void {
        this.routeSubscription = this.activeRoute.queryParams.subscribe(
            (params) => {
                this.filters = params.filters || '';
                // console.log('this is filter in getparams: ', this.filters);
                const metaData: MetaData = {};
                if (params.hasOwnProperty('new')) {
                    metaData.title = 'Shop New Arrivals for your Home | LazySuzy';
                }
                if (params.hasOwnProperty('sale')) {
                    metaData.title = 'Shop Top Deals for your Home | LazySuzy';
                }
                if (params.hasOwnProperty('bestseller')) {
                    metaData.title = 'Shop Best Sellers for your Home | LazySuzy';
                }

                const checkBrand = this.filters.indexOf('brand:');
                if (checkBrand < 0) {
                    this.selectedBrandValue = '';
                } else {
                    const restString = this.filters.slice(checkBrand + 6);
                    const endBrand = restString.indexOf(';');
                    this.selectedBrandValue = restString.substr(0, endBrand);
                    this.getBrandData(this.selectedBrandValue);
                }
                if (this.isBrandPage === true) {
                    this.eventEmitterService.isBrandSubject.next(this.selectedBrandValue);
                }
                this.seoService.setMetaTags(metaData);
                // console.log('this is selectedBrandValue: ', this.selectedBrandValue);

                // tslint:disable-next-line: radix
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
        this.setTitle(this.brandData.name);
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
                    // tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < response.length; i++) {
                        allProducts = [...allProducts, ...response[i].products];
                    }
                    this.products = allProducts;
                    this.updateQueryString();
                    this.totalCount = response[0].total;
                    this.productFilters = response[0].filterData;
                    this.sortTypeList = response[0].sortType;
                    this.isProductFetching = false;
                    if (this.cacheService.data.useCache) {
                        this.scrollToProductSKU = this.cacheService.data.productSku;
                        this.cacheService.data.useCache = false;
                        setTimeout(() => {
                            // this.productElement.nativeElement.getElementById
                            const el = document.getElementById(this.scrollToProductSKU);
                            window.scrollTo(0, el.offsetTop - 200);
                        }, 500);
                    }
                });
        } else {
            this.loadProducts();
        }

        // Code for cached product sku
    }

    loadProducts(): void {
        this.pageNo = 0;
        this.isProductFetching = true;
        this.productsSubscription = this.apiService
            .getAllProducts(this.trend, this.total, this.filters, this.sortType)
            .subscribe((payload: IProductsPayload) => {
                console.log('this is load Products: ', payload);
                this.products = payload.products;
                this.productFilters = payload.filterData;
                this.sortTypeList = payload.sortType;
                this.totalCount = payload.total;
                this.updateQueryString();
                this.isProductFetching = false;
                this.isChangingBrandList = false;
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

    getProductwithBrandName(brandValue: string) {
        if (this.selectedBrandValue !== brandValue) {
            this.isChangingBrandList = true;
            this.selectedBrandValue = brandValue;
            if (brandValue !== '') {
                this.filters = 'brand:' + brandValue + ';';
            } else {
                this.filters = '';
            }
            this.getBrandData(brandValue);
            // this.loadProducts();
        }
    }

    getBrandData(brandValue: string) {
        this.apiService.getBrandData(brandValue).subscribe((brandData: any) => {
            if (brandData.length !== 0) {
                this.brandData = brandData[0];
                console.log('this is brandData: ', this.brandData);
                if (brandValue !== '') {
                    this.setTitle(this.brandData);
                }
            }
        });
    }

    setTitle(brand: any) {
        const metaData: MetaData = {};
        metaData.title = `Shop ${brand.name} furniture for your home | LazySuzy`;
        metaData.description = brand.description;
        metaData.image = brand.logo;
        this.seoService.setMetaTags(metaData);
    }

    ngOnDestroy(): void {
        // this.setTitle();
    }

    onSetFilters(e): void {
        console.log('this is filter from filterbar: ', e);
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
        const self = this;
        if (this.isIconShow) {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                self.isIconShow = false;
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
        if (this.showMobileFilter) {
            this.hideIntercom();
        } else {
            this.showIntercom();
        }
    }

    hideIntercom() {
        const intercom = document.getElementsByClassName('intercom-lightweight-app')[0];
        intercom.classList.add('dn');
    }

    showIntercom() {
        const intercom = document.getElementsByClassName('intercom-lightweight-app')[0];
        intercom.classList.remove('dn');
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
