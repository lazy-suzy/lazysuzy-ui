import {Component, OnInit} from '@angular/core';
import {ApiService, UtilsService} from '../../../../shared/services';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-flash-sale',
    templateUrl: './flash-sale.component.html',
    styleUrls: ['./flash-sale.component.less']
})
export class FlashSaleComponent implements OnInit {

    flashDeals = [];
    statusOrder = [
        'DEAL_EXPIRED',
        'DEAL_ONGOING',
        'DEAL_COMING_NEXT',
        'DEAL_INQUEUE'
    ];

    constructor(
        private apiService: ApiService,
    ) {
    }

    ngOnInit() {
        this.apiService.getBlowOutDeals().pipe(first()).subscribe((response: any) => {
            this.flashDeals = response;
            this.flashDeals = this.flashDeals.sort((a, b) =>
                this.statusOrder.indexOf(a.status) - this.statusOrder.indexOf(b.status));
        });
    }






}
