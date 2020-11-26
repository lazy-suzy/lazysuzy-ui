import {Component, Input, OnInit} from '@angular/core';
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
    time: string;
    timeInterval;
    starIcons: string[] = [];
    comingUpImage = 'https://lazysuzy.com/images/landing/LightningDeals.png';

    constructor(
        private utils: UtilsService,
        private matDialogUtils: MatDialogUtilsService,
        private flashSaleService: FlashSaleService
    ) {
    }

    ngOnInit() {
        if (this.deal.status === 'DEAL_ONGOING') {
            this.setRemainingTimeInterval(this.deal.end_time);
        }
        if (this.deal.status === 'DEAL_COMING_NEXT') {
            this.setRemainingTimeInterval(this.deal.start_time);
        }
        if (this.deal.status === 'DEAL_INQUEUE') {
            this.setRemainingTimeInterval(this.deal.start_time);
        }
        this.setRating();
    }

    parsePrice(price) {
        return this.utils.parsePrice(price);
    }

    openProductModal() {
        this.matDialogUtils.openVariationDialog(this.deal.product_sku);
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

    setRemainingTimeInterval(endDate) {
        this.getTimeRemaining(endDate, this);
        this.timeInterval = setInterval(() => this.getTimeRemaining(endDate, this), 1000);
    }

    getTimeRemaining(endTime, self) {
        const total = Date.parse(endTime) - Date.parse(new Date().toISOString());
        const seconds = '0' + Math.floor((total / 1000) % 60);
        const minutes = '0' + Math.floor((total / 1000 / 60) % 60);
        const hours = '0' + Math.floor((total / (1000 * 60 * 60)) % 24);
        self.time = `${hours.slice(-2)}:${minutes.slice(-2)}:${seconds.slice(-2)}`;
        if (total <= 0) {
            clearInterval(self.timeInterval);
        }
    }

    calculateDiscount(deal) {
        return this.flashSaleService.calculateDiscount(deal);
    }

    addToCart(deal) {
        this.flashSaleService.addToCartDeal(deal);
    }
}
