import {ProductDetailsComponent} from './../product-details/product-details.component';
import {IProductPayload} from './../../../shared/models';
import {Component, OnInit, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';
import {
    BreakpointState,
    Breakpoints,
    BreakpointObserver,
} from '@angular/cdk/layout';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {
    ApiService,
    UtilsService,
    MatDialogUtilsService,
} from 'src/app/shared/services';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.less'],
})
export class ProductComponent implements OnInit {
    @Input() product: IProductPayload;
    starIcons: string[] = new Array();
    variationImage = '';
    isVariationImageVisible = false;
    modalSku: any;
    bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
        Breakpoints.Handset
    );

    bpSubscription: Subscription;
    numbOfSwatchItems: number;
    activeRouteSubscription: Subscription;
    minPrice;
    maxPrice;
    wasMinPrice;
    wasMaxPrice;

    constructor(
        public dialog: MatDialog,
        private breakpointObserver: BreakpointObserver,
        private location: Location,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private apiService: ApiService,
        private utilsService: UtilsService,
        private matDialogUtils: MatDialogUtilsService
    ) {
    }

    ngOnInit(): void {
        this.setRating();
        this.setPrices();
        this.bpSubscription = this.breakpointObserver
            .observe([Breakpoints.Small])
            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.numbOfSwatchItems = 3;
                } else {
                    this.numbOfSwatchItems = 6;
                }
            });
        // this.activeRouteSubscription = this.activeRoute.queryParams.subscribe(params => {

        // });
    }

    onDestroy(): void {
        this.bpSubscription.unsubscribe();
    }

    setRating(): void {
        let starCount = Math.round(this.product.rating * 2) / 2;
        while (starCount > 0.5) {
            this.starIcons.push('star');
            starCount -= 1;
        }
        if (starCount && this.starIcons.length < 5) {
            this.starIcons.push('star_half');
        } else if (this.starIcons.length < 5) {
            while (this.starIcons.length < 5) {
                this.starIcons.push('star_outline');
            }
        }
    }

    setPrices(): void {
        const prices = this.product.is_price.split('-');
        const wasPrices = this.product.was_price.split('-');
        this.setMinMaxPrice(prices);
        this.setWasMinMaxPrice(wasPrices);
    }

    setMinMaxPrice(prices: string[]) {
        if (prices.length === 1) {
            this.minPrice = +prices[0];
        } else {
            this.minPrice = +prices[0];
            this.maxPrice = +prices[1];
        }
    }
    // + unary operator convert string to integer
    setWasMinMaxPrice(prices: string[]) {
        if (prices.length === 1) {
            this.wasMinPrice = +prices[0];
        } else {
            this.wasMinPrice = +prices[0];
            this.wasMaxPrice = +prices[1];
        }
    }

    openDialog(): void {
        this.matDialogUtils.openMatDialog(this.product.sku);
    }

    openSwatchDialog(variation): void {
        this.matDialogUtils.openMatDialog(
            variation.has_parent_sku ? variation.variation_sku : variation.product_sku
        );
    }

    showVariationImage(imageUrl): void {
        this.variationImage = imageUrl;
        this.isVariationImageVisible = true;
    }

    hideVariationImage(): void {
        this.variationImage = '';
        this.isVariationImageVisible = false;
    }

    wishlistProduct(sku, mark, event) {
        event.stopPropagation();
        this.apiService
            .wishlistProduct(sku, mark, false)
            .subscribe((payload: any) => {
                this.product.wishlisted = mark;
            });
    }
}
