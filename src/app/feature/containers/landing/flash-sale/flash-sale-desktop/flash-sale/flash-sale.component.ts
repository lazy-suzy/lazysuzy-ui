import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../../../shared/services';
import {first} from 'rxjs/operators';
import {FlashSaleService} from '../../flash-sale.service';

@Component({
    selector: 'app-flash-sale',
    templateUrl: './flash-sale.component.html',
    styleUrls: ['./flash-sale.component.less']
})
export class FlashSaleComponent implements OnInit {

    flashDeals = [];
    statusOrder = [];

    constructor(
        private flashService: FlashSaleService,
    ) {
    }

    ngOnInit() {
        this.statusOrder = this.flashService.getStatusOrder();
        this.flashService.getBlowoutDeals().subscribe((response: any) => {
            this.flashDeals = response;
        });
    }


}
