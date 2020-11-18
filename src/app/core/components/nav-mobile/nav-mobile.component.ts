import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService, MatDialogUtilsService, UtilsService} from './../../../shared/services';
import {NavigationEnd, Router} from '@angular/router';
import {IAllDepartment} from '../../../shared/models/all-department.interface';
import {Subscription} from 'rxjs';
import {Location} from '@angular/common';
import {CookieService} from 'ngx-cookie-service';
import {EventEmitterService} from 'src/app/shared/services';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-nav-mobile',
    templateUrl: './nav-mobile.component.html',
    styleUrls: ['./nav-mobile.component.less']
})
export class NavMobileComponent implements OnInit {
    @ViewChild('drawer', {static: false}) drawer: any;
    @ViewChild('departmentSideNav', {static: false}) departmentSideNav: any;
    @ViewChild('brandSideNav', {static: false}) brandSideNav: any;
    @ViewChild('collectionSideNav', {static: false}) collectionSideNav: any;
    logoPath = 'assets/image/dark_logo_transparent.png';
    departments: IAllDepartment[];
    selectedIndex = null;
    menuVisible = false;
    mobileMenuContainer;
    showDepartment;
    showSearchComponent = false;
    notHome: boolean;
    isBoard: boolean;
    checkHomeRoute: Subscription;
    hideBar = false;
    eventSubscription: Subscription;
    cartProduct: number;
    brands = [];
    collections = [];
    deals: any;
    mobileDeals: any;
    showOffer = true;
    isFaqPage = false;

    constructor(
        private apiService: ApiService,
        private utils: UtilsService,
        private cookie: CookieService,
        private router: Router,
        private location: Location,
        private eventEmitterService: EventEmitterService,
        private matDialogUtils: MatDialogUtilsService
    ) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.menuVisible = false;
            }
        });
        this.checkHomeRoute = router.events.subscribe((val) => {
            // this.notHome = location.path() !== '';

            this.isFaqPage = location.path().match(/faq\-order/) !== null;
            this.notHome =
                location.path() !== '' && location.path().match(/board/) == null;
            this.isBoard = (location.path().match(/board/) !== null);
            this.showOffer =
                location.path().match(/checkout/) === null &&
                location.path().match(/board\/dashboard/) === null &&
                location.path().match(/blog/) == null;
        });
    }

    ngOnInit(): void {
        this.getDeals();
        this.openNewsletterPopup();
        this.eventSubscription = this.eventEmitterService.userChangeEvent
            .asObservable()
            .subscribe((user) => {
                this.eventEmitterService.updateCart.subscribe((payload) => {
                    // tslint:disable-next-line: radix
                    this.cartProduct = parseInt(localStorage.getItem('cart'));
                });
                // tslint:disable-next-line: radix
                this.cartProduct = parseInt(localStorage.getItem('cart'));
                this.getDepartments();
                this.getBrands();
                this.getCollections();
                this.router.events.subscribe((res) => {
                    const orderRoute = this.router.url.slice(1, 6);
                    if (this.router.url === '/checkout' || orderRoute === 'order') {
                        this.hideBar = true;
                    } else {
                        this.hideBar = false;
                    }
                });
            });
    }

    openNewsletterPopup() {
        const showNewsLetter =
            this.location.path().match(/checkout/) === null &&
            this.location.path().match(/board/) === null &&
            this.location.path().match(/blog/) == null;
        if (showNewsLetter) {
            setTimeout(() => this.matDialogUtils.openNewsLetter(true), 5000);
        }
    }

    getDeals() {
        this.apiService.getDeals().pipe(first()).subscribe((value: any) => {
            this.deals = value.sort((a, b) => {
                return a.rank - b.rank;
            });
            this.mobileDeals = this.deals.filter(deal => deal.is_mobile).filter(val => val.is_active);
        });
    }

    onDestroy(): void {
        this.checkHomeRoute.unsubscribe();
        this.eventSubscription.unsubscribe();
    }

    setIndex(index: number) {
        this.selectedIndex = index;
    }

    getDepartments() {
        this.apiService.getAllDepartments().subscribe((payload: any) => {
            this.departments = payload.all_departments;
        });
    }

    getBrands() {
        this.apiService.getBrands().subscribe((payload: any) => {
            this.brands = payload;
        });
    }

    getCollections() {
        this.apiService.getCollections().subscribe((payload: any) => {
            this.collections = payload;
        });
    }

    showMenu() {
        this.menuVisible = !this.menuVisible;
    }

    showDepartmentChild(dept) {
        if (dept === this.showDepartment) {
            this.showDepartment = undefined;
            return;
        }
        this.showDepartment = dept;
    }

    showSearchBar() {
        this.showSearchComponent = !this.showSearchComponent;
    }

    onSearchComplete(e) {
        this.showSearchComponent = false;
    }

    isLoggedIn(event) {
        event.preventDefault();
        event.stopPropagation();

        const localData = JSON.parse(localStorage.getItem('user') || '{}');
        if (localData.email.length > 0) {
            this.router.navigateByUrl('/wishlist');
        } else {
            this.matDialogUtils.openSignupDialog(true);
        }
    }

    toNewArrivalsPage() {
        this.router.navigate(['/products/all'], {queryParams: {new: true}});
        this.closeAll();
    }

    toTopDealsPage() {
        this.router.navigate(['/products/all'], {queryParams: {sale: true}});
        this.closeAll();
    }

    toBrandPage(brand) {
        this.router.navigate(['/products/brand'], {queryParams: {filters: `brand:${brand.value};`}});
        this.closeAll();
    }

    toCollectionPage(collection) {
        this.router.navigate(['/products/collections'], {queryParams: {filters: `collection:${collection.value};`}});
        this.closeAll();
    }

    closeAll() {
        this.drawer.close();
        this.departmentSideNav.close();
        this.brandSideNav.close();
        this.collectionSideNav.close();
    }

    openOfferModal() {
        this.matDialogUtils.openAllOffersDialog(this.deals);
    }
}
