import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {HttpParams} from '@angular/common/http';
import {IFilterData, IProductPayload, IProductsPayload, ISortType} from './../../../shared/models';
import {MatDialog} from '@angular/material/dialog';
import {
    ApiService,
    CacheService,
    EventEmitterService,
    MatDialogUtilsService,
    SeoService
} from './../../../shared/services';
import {SCROLL_ICON_SHOW_DURATION} from './../../../shared/constants';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {first} from 'rxjs/operators';
import MetaData from '../../../shared/services/seo/meta-data-model';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnInit {

    @ViewChild('productFiltersComponent', {static: true}) productFilter: any;
    productsSubscription: Subscription;
    routeSubscription: Subscription;
    products: IProductPayload[];
    productFilters: IFilterData = {
        brand: [],
        type: [],
        color: [],
        category: [],
        shape: [],
        seating: [],
        price: {from: 0, min: 0, max: 0, to: 0}
    };
    department: string;
    category: string;
    categoryTitle: string;
    emailTitle: string;
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
    modalSku = '';
    bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
        Breakpoints.Handset
    );
    bpSubscription: Subscription;
    isHandset: boolean;
    scrollToProductSKU = '';
    eventSubscription: Subscription;
    invalidLinkImageSrc = 'assets/image/invalid_link.png';
    invalidLink: boolean;
    brandData: any = {
        cover_image: '',
        description: '',
        logo: '',
        name: '',
        url: '',
        value: ''
    };
    // Collection List
    collectionList: any;
    showFilters = false;
    timeout: any;

    constructor(
        public dialog: MatDialog,
        private productElement: ElementRef,
        private apiService: ApiService,
        private router: Router,
        private location: Location,
        private activeRoute: ActivatedRoute,
        private breakpointObserver: BreakpointObserver,
        private matDialogUtils: MatDialogUtilsService,
        public cacheService: CacheService,
        private eventEmitterService: EventEmitterService,
        private seoService: SeoService
    ) {
    }

    ngOnInit(): void {
        this.eventSubscription = this.eventEmitterService.userChangeEvent
            .asObservable()
            .subscribe((user) => {
                this.getParams();
                this.getParamsFromQuery();
                this.modalSku = this.activeRoute.snapshot.queryParamMap.get(
                    'modal_sku'
                );
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

                if (this.modalSku) {
                    this.matDialogUtils.openMatDialog(this.modalSku);
                }
            });
        this.apiService.getCollections().pipe(first()).subscribe(collection => {
            this.collectionList = collection;
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
    }

    toggleFilterBar() {
        this.showFilters = !this.showFilters;
    }

    getParams(): void {
        const urlParams: string[] = this.router.url.split('/').slice(1);
        this.department = urlParams[1];
        this.category = urlParams[2].split('?')[1];
    }

    getParamsFromQuery(): void {
        this.activeRoute.queryParams.subscribe((params) => {
            this.filters = params.filters || '';
            this.pageNo = parseInt(params.pageNo, 10) || 0;
            this.sortType = params.sortType || 'recommended';
        });
    }

    checkPage() {
        // get brandData when page is loading
        // const checkBrand = this.filters.indexOf('brand:');
        // if (checkBrand > -1) {
        //   const endBrand = this.filters.indexOf(';');
        //   const brandName = this.filters.substr(6, endBrand - 6);
        //   this.getBrandData(brandName);
        // }

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
                    // tslint:disable-next-line: prefer-for-of
                    console.log('check for length error: ', response.length);
                    for (let i = 0; i < response.length; i++) {
                        allProducts = [...allProducts, ...response[i].products];
                    }
                    this.categoryTitle = response[0].seo_data.page_title;
                    this.emailTitle = response[0].seo_data.email_title;
                    this.products = allProducts;
                    this.updateQueryString();
                    this.totalCount = response[0].total;
                    delete response[0].filterData.category;
                    this.productFilters = response[0].filterData;
                    this.sortTypeList = response[0].sortType;
                    this.isProductFetching = false;

                    // this.productFilters.brand.map((item: any) => {
                    //   if(item.checked === true) {
                    //     this.getBrandData(item.value);
                    //   }
                    // })
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

    getProductwithBrandName(brandValue) {
        console.log('this is brandValue: ', brandValue);
        // let filterValue = '';
        // if (brandValue !== '') {
        //   filterValue = 'brand:' + brandValue + ';';
        // };
        // this.router.navigateByUrl(`/products/brand?undefined=true&limit=24&filters=${filterValue}&sort_type=&pageno=1`)
    }

    loadProducts(): void {
        this.pageNo = 0;
        this.isProductFetching = true;
        this.productsSubscription = this.apiService
            .getProducts(this.department, this.category, this.filters, this.sortType)
            .subscribe(
                (payload: IProductsPayload) => {
                    const metaData: MetaData = {
                        title: `Shop ${payload.seo_data.dept_name_long} Sofas at LazySuzy`,
                        image: payload.seo_data.cat_image,
                        description: payload.seo_data.description,
                    };
                    if (!this.modalSku) {
                        this.seoService.setMetaTags(metaData);
                        this.seoService.setCanonicalURL();
                    }
                    this.categoryTitle = payload.seo_data.page_title;
                    this.emailTitle = payload.seo_data.email_title;
                    this.products = payload.products;
                    delete payload.filterData.category;
                    this.productFilters = payload.filterData;
                    this.sortTypeList = payload.sortType;
                    this.totalCount = payload.total;
                    this.updateQueryString();
                    this.isProductFetching = false;
                    this.invalidLink = false;
                },
                (error) => {
                    this.invalidLink = true;
                    this.isProductFetching = false;
                }
            );
    }

    updateQueryString(): void {
        let params = new HttpParams();
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

    onSetFilters(e): void {
        this.filters = e;
        this.loadProducts();
    }

    onSetBrand(brandName: string) {
        if (brandName === '') {
            this.filters = '';
        } else {
            const checkBrand = this.filters.indexOf('brand:');
            if (checkBrand < 0) {
                this.filters += 'brand:' + brandName + ';';
            } else {
                const endBrand = this.filters.indexOf(';');
                this.filters = 'brand:' + brandName + ';' + this.filters.substr(endBrand + 1);
            }
            // this.getBrandData(brandName);
        }
        this.loadProducts();
    }

    // getBrandData(brandName: string) {
    //   this.apiService.getBrandData(brandName).subscribe((brandData: any) => {
    //     console.log('check for length error: ', brandData.length)

    //     if (brandData.length !== 0) {
    //       this.brandData = brandData[0];
    //     }
    //   })
    // }

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
