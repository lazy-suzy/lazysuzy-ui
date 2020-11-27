import {Component, OnInit} from '@angular/core';
import {FlashSaleService} from '../../flash-sale.service';

@Component({
    selector: 'app-flash-sale-mobile',
    templateUrl: './flash-sale-mobile.component.html',
    styleUrls: ['./flash-sale-mobile.component.less']
})
export class FlashSaleMobileComponent implements OnInit {

    deals: any;
    statusOrder: any;
    onlyActiveAndRecentDeals: any[] = [];
    upcomingDeals: any = [];

    constructor(
        private flashSaleService: FlashSaleService
    ) {
    }

    ngOnInit() {
        this.statusOrder = this.flashSaleService.getStatusOrder();
        this.getFlashDeals();
    }

    reloadDealProducts() {
        this.getFlashDeals();
    }

    getFlashDeals() {
        this.flashSaleService.getBlowoutDeals().subscribe(response => {
                this.deals = response;
                this.onlyActiveAndRecentDeals = this.deals.filter(deal => {
                    return deal.status === 'DEAL_ONGOING' || deal.status === 'DEAL_COMING_NEXT';
                });
                this.upcomingDeals = this.deals.filter(deal =>
                    deal.status === 'DEAL_INQUEUE'
                );
            }
        );
    }
}
