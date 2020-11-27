import {Component, Input, OnInit} from '@angular/core';
import {FlashSaleService} from '../../flash-sale.service';

@Component({
    selector: 'app-flash-sale-mobile-product-horizontal',
    templateUrl: './flash-sale-mobile-product-horizontal.component.html',
    styleUrls: ['./flash-sale-mobile-product-horizontal.component.less']
})
export class FlashSaleMobileProductHorizontalComponent implements OnInit {
    @Input() deal;
    comingUpImage = 'https://lazysuzy.com/images/landing/LightningDeals.png';
    time: string;
    timeInterval;

    constructor(
        private flashSaleService: FlashSaleService
    ) {
    }

    ngOnInit() {
        this.setRemainingTimeInterval();
    }

    setRemainingTimeInterval() {
        this.getTimeRemaining(this);
        this.timeInterval = setInterval(() => this.getTimeRemaining(this), 1000);
    }

    getTimeRemaining(self) {
        self.time = this.flashSaleService.getTimeRemaining(self.deal.time);
        if (self.deal.time <= 0) {
            clearInterval(self.timeInterval);
        }
        self.deal.time -= 1;
    }
}
