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

    openProductModal(productSku) {
        this.matDialogUtils.openVariationDialog(productSku);
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
            parent_sku: deal.parent_sku,
            cart_origin: 'blowout_flash'
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
        const priceRange = price.trim().split('-');
        const wasPriceRange = was_price.trim().split('-');
        const discountMin = ((wasPriceRange[0] - priceRange[0]) / wasPriceRange[0]) * 100;
        let discountMax = 0;
        if (priceRange.length > 1) {
            discountMax = ((wasPriceRange[1] - priceRange[1]) / wasPriceRange[1]) * 100;
        }
        const discount = Math.max(discountMin, discountMax);
        return `${Math.round(discount)}% off`;
    }

    calculatePercentSold(deal) {
        return (deal.quantity / deal.total_quantity) * 100;
    }

    isDiscounted(deal) {
        const {was_price, price} = deal;
        const priceRange = price.trim().split('-');
        const wasPriceRange = was_price.trim().split('-');
        const discountMin = ((wasPriceRange[0] - priceRange[0]) / wasPriceRange[0]) * 100;
        let discountMax = 0;
        if (priceRange.length > 1) {
            discountMax = ((wasPriceRange[1] - priceRange[1]) / wasPriceRange[1]) * 100;
        }
        const discount = Math.max(discountMin, discountMax);
        return discount !== 0;
    }

    getTimeRemaining(time) {
        // const total = Date.parse(endTime) - this.serverTime;
        const total = time * 1000;
        const seconds = '0' + Math.floor((total / 1000) % 60);
        const minutes = '0' + Math.floor((total / 1000 / 60) % 60);
        const hours = '0' + Math.floor((total / (1000 * 60 * 60)) % 24);
        return `${hours.slice(-2)}:${minutes.slice(-2)}:${seconds.slice(-2)}`;
    }
}