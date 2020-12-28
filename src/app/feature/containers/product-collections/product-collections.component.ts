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
    selector: 'app-product-collections',
    templateUrl: './product-collections.component.html',
    styleUrls: ['./product-collections.component.less']
})
export class ProductCollectionsComponent implements OnInit {
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
    fixFilterBar = 900;
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
    collectionData: any = {};
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
        private  seoService: SeoService
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

    toggleFilterBar() {
        this.showFilters = !this.showFilters;
    }

    getParamsFromQuery(): void {
        this.routeSubscription = this.activeRoute.queryParams.subscribe(
            (params) => {
                this.filters = params.filters || '';
                // console.log('this is filter in getparams: ', this.filters);
                const checkBrand = this.filters.indexOf('collection:');
                if (checkBrand < 0) {
                    this.selectedBrandValue = '';
                } else {
                    const restString = this.filters.slice(checkBrand + 11);
                    const endBrand = restString.indexOf(';');
                    this.selectedBrandValue = restString.substr(0, endBrand);
                    this.getProductsWithCollection(this.selectedBrandValue);
                }
                if (this.isBrandPage === true) {
                    this.eventEmitterService.isBrandSubject.next(this.selectedBrandValue);
                }
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
        if (this.trend) {
            params = params.set(this.trend, 'true');
        }
        if (this.filters) {
            params = params.set('filters', this.filters);
        }
        if (this.sortType) {
            params = params.set('sortType', this.sortType);
        }
        if (this.pageNo) {
            params = params.set('pageNo', this.pageNo.toString());
        }

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
                    this.setTitle(this.brandData.name);
                } else {
                    this.setTitle('');
                }
            }
        });
    }

    getProductsWithCollection(collection) {
        this.apiService.getCollectionData(collection).pipe(first()).subscribe(collectionData => {
            this.collectionData = collectionData;
            if (this.collectionData) {
                this.setTitle(this.collectionData);
            }
        });
    }

    setTitle(collection) {
        if (collection) {
            const metaData: MetaData = {};
            metaData.title = `Shop ${collection.brand_name} ${collection.name} furniture for your home | LazySuzy`;
            metaData.description = collection.head_description;
            metaData.image = collection.cover_details.image;
            this.seoService.setMetaTags(metaData);
        } else {
            this.seoService.setMetaTags({});
        }
    }

    ngOnDestroy(): void {
        this.setTitle(0);
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

    @HostListener('window:scroll', ['$event'])
    checkScroll($event) {
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
        if (!this.showBar) {
            this.gotoTop();
        }
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
        if (!this.showBar) {
            this.gotoTop();
        }
        this.showMobileSort = !this.showMobileSort;
    }

    toggleMobileView() {
        if (this.productsInRow === 3) {
            this.productsInRow = 1;
        } else {
            this.productsInRow += 1;
        }
    }

    checkBannerShow(index) {
        const filters = this.filters.split(';').filter(value => value); //remove empty values
        if (filters.length > 1) {
            return false;
        }
        const afterProductToShow = 6;
        return index !== 0 && (index + 1) % afterProductToShow == 0 && this.collectionData.sub_details.length >= ((index + 1) / afterProductToShow);
    }
}
