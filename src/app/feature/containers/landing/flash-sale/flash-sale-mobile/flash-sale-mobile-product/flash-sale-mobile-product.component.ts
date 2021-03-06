import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FlashSaleService} from '../../flash-sale.service';
import {Router} from '@angular/router';
import {UtilsService} from '../../../../../../shared/services';

@Component({
    selector: 'app-flash-sale-mobile-product',
    templateUrl: './flash-sale-mobile-product.component.html',
    styleUrls: ['./flash-sale-mobile-product.component.less']
})
export class FlashSaleMobileProductComponent implements OnInit {
    @Input() deal: any;
    @Output() dealTimeCompleted: EventEmitter<any> = new EventEmitter<any>();
    statusOrder: any = [];
    time: string;
    timeInterval;
    starIcons: string[] = [];
    comingUpImage = 'https://lazysuzy.com/images/landing/LightningDeals.png';

    constructor(
        public flashSaleService: FlashSaleService,
        public utils: UtilsService,
        private router: Router
    ) {
        this.statusOrder = flashSaleService.getStatusOrder();
    }

    parsePrice(price) {
        return this.utils.formatPriceNew(price);
    }

    ngOnInit() {
        if (this.deal.status === 'DEAL_ONGOING') {
            this.setRemainingTimeInterval();
        }
        if (this.deal.status === 'DEAL_COMING_NEXT') {
            this.setRemainingTimeInterval();
        }
        this.setRating();
    }

    openProduct() {
        this.router.navigate(['/product', this.deal.product_sku]);
    }

    setRating(): void {
        let starCount = Math.round(this.deal.rating * 2) / 2;
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

    calculateDiscount(deal) {
        return this.flashSaleService.calculateDiscount(deal);
    }

    calculatePercentSold() {
        return this.flashSaleService.calculatePercentSold(this.deal);
    }

    addToCart() {
        this.flashSaleService.addToCartDeal(this.deal);
    }

    setRemainingTimeInterval() {
        this.getTimeRemaining(this);
        this.timeInterval = setInterval(() => this.getTimeRemaining(this), 1000);
    }

    getTimeRemaining(self) {
        self.time = this.flashSaleService.getTimeRemaining(self.deal.time);
        if (self.deal.time <= 0) {
            clearInterval(self.timeInterval);
            self.dealTimeCompleted.emit(true);
        }
        self.deal.time -= 1;
    }
}
