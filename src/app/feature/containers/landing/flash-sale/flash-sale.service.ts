import {Injectable} from '@angular/core';
import {ApiService, MatDialogUtilsService} from '../../../../shared/services';
import {PixelService} from '../../../../shared/services/facebook-pixel/pixel.service';
import {first, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FlashSaleService {
    statusOrder = [
        'DEAL_EXPIRED',
        'DEAL_ONGOING',
        'DEAL_COMING_NEXT',
        'DEAL_INQUEUE'
    ];

    constructor(
        private apiService: ApiService,
        private pixelService: PixelService,
        private matDialogUtils: MatDialogUtilsService
    ) {
    }

    getStatusOrder() {
        return this.statusOrder;
    }

    getBlowoutDeals() {
        return this.apiService.getBlowOutDeals().pipe(first(),
            map((response: any[]) => {
                let deals = response;
                deals = deals.sort((a, b) =>
                    this.statusOrder.indexOf(a.status) - this.statusOrder.indexOf(b.status));
                return deals;
            }));
    }

    addToCartDeal(deal) {
        const data = {
            sku: deal.product_sku,
            brand: deal.brand,
            image: deal.image,
            name: deal.product_name,
            price: deal.price,
            quantity: 1
        };
        const postData = {
            product_sku: deal.product_sku,
            count: 1,
            parent_sku: deal.parent_sku
        };
        this.apiService.addCartProduct(postData).subscribe(
            (payload: any) => {
                if (payload.status) {

                    this.matDialogUtils.openAddToCartDialog(data);
                    this.pixelService.trackAddToCart(data);
                } else {
                }
            },
            (error: any) => {
                // this.errorMessage = 'Cannot add this product at the moment.';
            }
        );
    }

    calculateDiscount(deal) {
        const {was_price, price} = deal;
        const discount = ((was_price - price) / was_price) * 100;
        return `${Math.round(discount)}% off`;
    }

    calculatePercentSold(deal) {
        return (deal.quantity / deal.total_quantity) * 100;
    }
}
