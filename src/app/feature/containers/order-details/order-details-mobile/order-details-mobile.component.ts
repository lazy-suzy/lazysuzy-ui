import {Component, Input, OnInit} from '@angular/core';
import {OrderInfo} from '../OrderDetails.interface';

@Component({
    selector: 'app-order-details-mobile',
    templateUrl: './order-details-mobile.component.html',
    styleUrls: ['./order-details-mobile.component.less']
})
export class OrderDetailsMobileComponent implements OnInit {

    @Input() orderDetails: OrderInfo[];
    orderDetailsOpenStatus = [];

    constructor() {
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
}
