import {Component, Input, OnInit} from '@angular/core';
import {OrderDetailProduct, OrderInfo} from '../OrderDetails.interface';
import {MatDialogUtilsService} from '../../../../shared/services';

@Component({
    selector: 'app-order-details-desktop',
    templateUrl: './order-details-desktop.component.html',
    styleUrls: ['./order-details-desktop.component.less']
})
export class OrderDetailsDesktopComponent implements OnInit {
    @Input() orderDetails: OrderInfo[];

    constructor(
        private matDialogUtilsService: MatDialogUtilsService
    ) {
    }

    ngOnInit() {
    }

    calculateTotalItems(items: OrderDetailProduct[]): string {
        const length = items.reduce((acc, item: any) => {
            return acc + item.quantity;
        }, 0);
        return length > 1 ? `${length} items` : `${length} item`;
    }

    openProductPage(sku) {
        this.matDialogUtilsService.openMatDialog(sku);
    }
}
