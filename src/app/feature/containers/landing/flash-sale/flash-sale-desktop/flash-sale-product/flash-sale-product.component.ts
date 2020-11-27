import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService, MatDialogUtilsService, UtilsService} from '../../../../../../shared/services';
import {PixelService} from '../../../../../../shared/services/facebook-pixel/pixel.service';
import {FlashSaleService} from '../../flash-sale.service';

@Component({
    selector: 'app-flash-sale-product',
    templateUrl: './flash-sale-product.component.html',
    styleUrls: ['./flash-sale-product.component.less']
})
export class FlashSaleProductComponent implements OnInit {
    @Input() deal: any;
    @Input() statusOrder: string[];
    @Output() dealTimeCompleted: EventEmitter<any> = new EventEmitter<any>();
    time: string;
    timeInterval;
    starIcons: string[] = [];
    comingUpImage = 'https://lazysuzy.com/images/landing/LightningDeals.png';
    serverTime = 0;

    constructor(
        private utils: UtilsService,
        private matDialogUtils: MatDialogUtilsService,
        private flashSaleService: FlashSaleService
    ) {
    }

    ngOnInit() {
        this.serverTime = Date.parse(this.deal.now);
        if (this.deal.status === 'DEAL_ONGOING') {
            this.setRemainingTimeInterval();
        }
        if (this.deal.status === 'DEAL_COMING_NEXT') {
            this.setRemainingTimeInterval();
        }
        if (this.deal.status === 'DEAL_INQUEUE') {
            this.setRemainingTimeInterval();
        }
        this.setRating();
    }

    parsePrice(price) {
        return this.utils.formatPriceNew(price);
    }

    openProductModal() {
        this.matDialogUtils.openMatDialog(this.deal.product_sku);
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

    calculatePercentSold() {
        return this.flashSaleService.calculatePercentSold(this.deal);
    }

    setRemainingTimeInterval() {
        this.getTimeRemaining(this);
        this.timeInterval = setInterval(() => this.getTimeRemaining(this), 1000);
    }

    getTimeRemaining(self) {
        // const total = Date.parse(endTime) - this.serverTime;
        self.time = this.flashSaleService.getTimeRemaining(self.deal.time);
        if (self.deal.time <= 0) {
            clearInterval(self.timeInterval);
            self.dealTimeCompleted.emit(true);
        }
        self.deal.time -= 1;
        //  this.serverTime += 1000;
    }

    calculateDiscount(deal) {
        return this.flashSaleService.calculateDiscount(deal);
    }

    addToCart(deal) {
        this.flashSaleService.addToCartDeal(deal);
    }
}
