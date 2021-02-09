import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-order-details-mobile',
    templateUrl: './order-details-mobile.component.html',
    styleUrls: ['./order-details-mobile.component.less']
})
export class OrderDetailsMobileComponent implements OnInit {

    @Input() orderDetails: any;

    constructor() {
    }

    ngOnInit() {
    }

}
