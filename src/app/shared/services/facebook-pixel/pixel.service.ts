import {Injectable} from '@angular/core';

declare const fbq;

@Injectable({
    providedIn: 'root'
})
export class PixelService {

    constructor() {
    }

    public trackAddToCart(product: any) {
        console.log('track add to Cart');
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
}
