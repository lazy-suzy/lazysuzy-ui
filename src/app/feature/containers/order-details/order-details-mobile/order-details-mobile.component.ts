import {Component, Input, OnInit} from '@angular/core';
import {OrderInfo} from '../OrderDetails.interface';
import {Router} from '@angular/router';

@Component({
    selector: 'app-order-details-mobile',
    templateUrl: './order-details-mobile.component.html',
    styleUrls: ['./order-details-mobile.component.less']
})
export class OrderDetailsMobileComponent implements OnInit {

    @Input() orderDetails: OrderInfo[];
    orderDetailsOpenStatus = [];

    constructor(
        private router: Router
    ) {
    }

    ngOnInit() {
        this.orderDetailsOpenStatus = new Array(this.orderDetails.length).fill(false);
    }

    expandItem(index) {
        this.orderDetailsOpenStatus[index] = true;
    }

    closeItem(index) {
        this.orderDetailsOpenStatus[index] = false;
    }

    openProductPage(sku) {
        this.router.navigate(['/product', sku]);
    }
}
