import {Component, Input, OnInit} from '@angular/core';
import {FlashSaleService} from '../../flash-sale.service';

@Component({
    selector: 'app-flash-sale-mobile-product',
    templateUrl: './flash-sale-mobile-product.component.html',
    styleUrls: ['./flash-sale-mobile-product.component.less']
})
export class FlashSaleMobileProductComponent implements OnInit {
    @Input() deal: any;
    statusOrder: any = [];
    time: string;
    timeInterval;
    starIcons: string[] = [];


    constructor(
        private flashSaleService: FlashSaleService
    ) {
        this.statusOrder = flashSaleService.getStatusOrder();
    }

    ngOnInit() {
        if (this.deal.status === 'DEAL_ONGOING') {
            this.setRemainingTimeInterval(this.deal.end_time);
        }
        if (this.deal.status === 'DEAL_COMING_NEXT') {
            this.setRemainingTimeInterval(this.deal.start_time);
        }
        this.setRating();
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
}
