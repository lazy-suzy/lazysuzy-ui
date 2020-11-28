import {IProductPayload} from './../../../shared/models';
import {Component, OnInit, Input} from '@angular/core';
import {ApiService} from 'src/app/shared/services';

@Component({
    selector: 'app-product-mobile',
    templateUrl: './product-mobile.component.html',
    styleUrls: ['./product-mobile.component.less']
})
export class ProductMobileComponent implements OnInit {
    @Input() product: IProductPayload;
    @Input() productsInRow: number;

    isVariationImageVisible = false;
    priceObject = {
        isPrice: 0,
        wasPrice: 0
    };
    isDiscounted = false;
    isRange = false;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.formatPriceText(this.product);
    }

    formatPriceText(product) {
        let {is_price, was_price} = product;
        is_price = is_price.split('-');
        was_price = was_price.split('-');
        if (is_price.length > 1) {
            this.isRange = true;
        }
        this.priceObject.isPrice = Number(is_price[0]);
        this.isDiscounted = was_price && Number(was_price[0]) > Number(is_price[0]);
        if (this.isDiscounted) {
            this.priceObject.wasPrice = Number(was_price[0]);
        }
    }

    wishlistProduct(sku, mark, event) {
        event.stopPropagation();
        this.apiService
            .wishlistProduct(sku, mark, true)
            .subscribe((payload: any) => {
                this.product.wishlisted = mark;
            });
    }

    renderPrice(price: number): number | string {
        const quotient = Math.floor(price);
        let remainder = Number((price - quotient).toPrecision(2));
        if (remainder === 0) {
            return quotient;
        } else {
            return price.toFixed(2);
        }
    }
}
