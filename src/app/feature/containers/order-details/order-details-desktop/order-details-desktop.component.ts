import {Component, Input, OnInit} from '@angular/core';
import {OrderDetailProduct, OrderInfo} from '../OrderDetails.interface';

@Component({
    selector: 'app-order-details-desktop',
    templateUrl: './order-details-desktop.component.html',
    styleUrls: ['./order-details-desktop.component.less']
})
export class OrderDetailsDesktopComponent implements OnInit {
    @Input() orderDetails: OrderInfo[];

    constructor() {
    }

    ngOnInit() {
    }

    calculateTotalItems(items: OrderDetailProduct[]): number {
        return items.reduce((acc, item: any) => {
            return acc + item.quantity;
        }, 0);
    }
}
