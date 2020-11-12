import {Injectable} from '@angular/core';

declare const fbq;

@Injectable({
    providedIn: 'root'
})
export class PixelService {

    constructor() {
    }

    public trackAddToCart(product: any) {
        const options = {
            contents: [
                {
                    id: product.sku,
                    quantity: product.quantity
                }
            ],
            currency: 'USD',
            value: product.price,
            content_type: 'product'
        };
        fbq('track', 'AddToCart', options);
    }

    public trackPurchase(order: any) {
        const options = {
            currency: 'USD',
            value: order.amount,
        };
        fbq('track', 'Purchase', options);
    }

    public trackInitiateCheckout() {
        fbq('track', 'InitiateCheckout');
    }

    public trackViewContent() {
        fbq('track', 'ViewContent');
    }
}

