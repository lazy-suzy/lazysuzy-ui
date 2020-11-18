import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {IAllDepartment} from '../../../shared/models';
import {ApiService, MatDialogUtilsService, UtilsService} from './../../../shared/services';
import {MessageService} from 'primeng/api';
import {CookieService} from 'ngx-cookie-service';
import {EventEmitterService} from 'src/app/shared/services';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-nav-desktop',
    templateUrl: './nav-desktop.component.html',
    styleUrls: ['./nav-desktop.component.less']
})
export class NavDesktopComponent implements OnInit {
    @Input() isTablet: boolean;
    logoPath = 'assets/image/dark_logo_transparent.png';
    departments: IAllDepartment[];
    notHome: boolean;
    checkHomeRoute: Subscription;
    eventSubscription: Subscription;
    email: any;
    password: any;
    hideBar = false;
    cartProduct: number;
    isFaqPage = false;
    isBrandPage: boolean = false;
    params: any;
    deals: any;
    showOffer = false;
    //
    isShop = true;
    isBoard = false;

    constructor(
        private router: Router,
        private location: Location,
        private utils: UtilsService,
        private apiService: ApiService,
        private messageService: MessageService,
        private cookie: CookieService,
        private activatedRoute: ActivatedRoute,
        private eventEmitterService: EventEmitterService,
        private matDialogUtils: MatDialogUtilsService,
        private activeRoute: ActivatedRoute
    ) {
        this.checkHomeRoute = router.events.subscribe((val) => {
            // this.notHome = location.path() !== '';
            this.isFaqPage = location.path().match(/faq\-order/) !== null ||
                location.path().match(/furniture\-care/) !== null;
            this.notHome =
                location.path() !== '' &&
                location.path().match(/board/) == null &&
                location.path().match(/blog/) == null &&
                location.path().match(/faq\-order/) == null &&
                location.path().match(/furniture\-care/) == null;
            this.showOffer =
                location.path().match(/checkout/) === null &&
                location.path().match(/board/) === null &&
                location.path().match(/blog/) == null;
            this.isShop = location.path().match(/board/) == null;
            this.isBoard = location.path().match(/board/) !== null;
        });
    }

    ngOnInit(): void {
        this.getDeals();
        this.loadNewsLetterPopup();
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
                this.router.events.subscribe((res) => {
                    const orderRoute = this.router.url.slice(1, 6);
                    if (
                        this.router.url === '/aboutus' ||
                        this.router.url === '/checkout' ||
                        orderRoute === 'order'
                    ) {
                        this.hideBar = true;
                    } else {
                        this.hideBar = false;
                    }
                });
            });

        this.eventEmitterService.isBrandSubject.subscribe((brandValue: string) => {
            this.getDepartments(brandValue);
        });

        this.activeRoute.queryParams.subscribe((params) => {
            // this.isClearAllVisible = params.filters !== '';
            this.params = params;
        });
    }

    getDeals() {
        this.apiService.getDeals().pipe(first()).subscribe((value: any) => {
            this.deals = value.sort((a, b) => {
                return a.rank - b.rank;
            });
            this.deals = this.deals.filter(v => {
                return v.is_active;
            });
        });
    }

    loadNewsLetterPopup() {
        const showNewsLetter =
            this.location.path().match(/checkout/) === null &&
            this.location.path().match(/board/) === null &&
            this.location.path().match(/blog/) == null;
        if (showNewsLetter) {
            setTimeout(() => this.matDialogUtils.openNewsLetter(), 5000);
        }
    }

    onDestroy(): void {
        this.checkHomeRoute.unsubscribe();
        this.eventSubscription.unsubscribe();
    }

    login() {
        const user = {
            email: this.email,
            password: this.password
        };
        if (user.email && user.password) {
            this.apiService.login(user).subscribe((res) => {
                // tslint:disable-next-line: no-string-literal
                if (res['data']) {
                    // this.apiService.storeUserData(res["token"]);
                    // localStorage.setItem("admin_id", res["data"]["id"]);
                    // localStorage.setItem("role", res["data"]["role"]);
                    // this.router.navigate(["admin"]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success Message',
                        detail: 'User logged in'
                    });
                }
            });
            // .catch(err => {
            //   this.messageService.add({
            //     severity: "error",
            //     summary: " Error Message",
            //     detail: "Invalid Email or Password"
            //   });
            // });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: ' Error Message',
                detail: 'Please Enter Email and Password'
            });
        }
    }

    isLoggedIn(event) {
        event.preventDefault();
        event.stopPropagation();
        const localData = JSON.parse(localStorage.getItem('user') || '{}');
        if (localData.email.length > 0) {
            this.router.navigateByUrl('/wishlist');
        } else {
            this.matDialogUtils.openSignupDialog(false);
        }
    }

    getDepartments(brandValue: string = '') {
        console.log('brand value: ', brandValue);
        // flag value to show nav bar in brand page
        let brandValueForDepart = '';
        if (brandValue === '' || brandValue === undefined) {
            this.isBrandPage = false;
            brandValueForDepart = '';
        } else {
            this.isBrandPage = true;
            brandValueForDepart = brandValue;
        }
        this.apiService.getAllDepartments(brandValueForDepart).subscribe((payload: any) => {
            this.departments = payload.all_departments;
        });
    }

    setCategoryForBrandPage(categoryValue: number) {
        let newParams: any = this.params;
        let filterValue: string = newParams.filters || '';
        const checkCategoryPos = filterValue.indexOf('category:');
        if (checkCategoryPos < 0) {
            filterValue += `category:${categoryValue};`;
        } else {
            const restString = filterValue.slice(checkCategoryPos + 9);
            const endBrandPos = restString.indexOf(';');
            const subCategoryString = filterValue.substr(checkCategoryPos, (endBrandPos + checkCategoryPos));
            const newFilterValue = filterValue.replace(subCategoryString, `category:${categoryValue};`);
            filterValue = newFilterValue;
        }
        const resultFilter = {
            ...newParams,
            ...{filters: filterValue}
        };
        this.router.navigate(['products/brand'], {queryParams: resultFilter});
    }

    openOfferModal() {
        this.matDialogUtils.openAllOffersDialog(this.deals);
    }
}
