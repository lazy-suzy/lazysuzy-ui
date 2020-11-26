import {Component, Input, OnInit} from '@angular/core';
import moment from 'moment';

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

    constructor() {
    }

    ngOnInit() {
        this.setRemainingTimeInterval(this.deal.start_time);
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
