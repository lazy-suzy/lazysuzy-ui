import {ElementRef, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SignupComponent} from 'src/app/core/components';
import {MarkdownService} from 'ngx-markdown';
import {environment as env} from 'src/environments/environment';
import {Observable, Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState,} from '@angular/cdk/layout';
import {formatCurrency, getLocaleCurrencySymbol} from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    signupRef: ElementRef;
    readonly userType = {
        guest: 0,
        default: 1,
    };

    bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
        Breakpoints.Handset
    );
    bpSubscription: Subscription;
    signInDialogRef: any;
    signUpDialogRef: any;

    constructor(
        public dialog: MatDialog,
        private markdownService: MarkdownService,
        private breakpointObserver: BreakpointObserver
    ) {
    }

    closeDialogs() {
        this.dialog.closeAll();
    }

    checkDataLength(data) {
        if (Array.isArray[data]) {
            return data.length > 0 && data[0].length > 0;
        }
        return data.length > 0;
    }

    hasInventory(product) {
        if (product.in_inventory) {
            return (
                product.in_inventory && product.inventory_product_details.count > 0
            );
        } else {
            return false;
        }
    }

    openSignupDialog(isHandset = false, isClose = false) {
        const width = isHandset ? '100%' : '35%';
        // tslint:disable-next-line: no-unused-expression
        !isClose && this.dialog.closeAll();
        return this.dialog.open(SignupComponent, {
            width,
            data: {isClose},
            panelClass: 'auth-dialog-container',
            autoFocus: false,
        });
    }

    compileMarkdown(data, site = 'West Elm') {
        let compileData;
        if (site !== 'West Elm') {
            compileData = data.map((item) => `*   ${item}`);
        } else {
            compileData = data;
        }
        let mergedData = '';
        for (const item of compileData) {
            mergedData = `${mergedData}${
                item.indexOf('</h6>') > -1 ? '\n' : ''
            }${item}\n${item.indexOf('</h6>') > -1 ? '\n' : ''}`;
        }
        return this.markdownService.compile(mergedData);
    }

    updateBoardLike(board, like) {
        return (
            (board.is_liked = like),
                (board.like_count = like ? board.like_count + 1 : board.like_count - 1)
        );
    }

    updateProfileImageLink(picture) {
        return picture.includes('http') ? picture : env.BASE_HREF + picture;
    }

    formatPrice(price) {
        if (price) {
            const priceString = price.toString();
            let minRange;
            let maxRange;
            let result;
            const splitedPrice = priceString.split('-');
            minRange = parseFloat(splitedPrice[0]).toFixed(2);
            if (splitedPrice.length > 1) {
                maxRange = parseFloat(splitedPrice[1]).toFixed(2);
                result = minRange.toString() + ' - ' + maxRange.toString();
            } else {
                maxRange = null;
                result = minRange.toString();
            }
            return result;
        } else {
            return '0';
        }
    }

    formatPriceNew(price) {
        if (price) {
            const priceString = price.toString();
            let minRange;
            let maxRange;
            let result;
            const splitedPrice = priceString.split('-');
            minRange = this.parsePrice(splitedPrice[0]);
            if (splitedPrice.length > 1) {
                maxRange = this.parsePrice(splitedPrice[1]);
                result = minRange.toString() + ' - ' + maxRange.toString();
            } else {
                maxRange = null;
                result = minRange.toString();
            }
            return result;
        } else {
            return '0';
        }
    }

    formatPriceMobile(price, wasPrice) {
        if (price) {
            const priceString = price.toString();
            let minRange;
            let maxRange;
            let result;
            const splitedPrice = priceString.split('-');
            minRange = parseFloat(splitedPrice[0]).toFixed(2);
            if (splitedPrice.length > 1) {
                maxRange = parseFloat(splitedPrice[1]).toFixed(2);
                if (!wasPrice) {
                    result = `From ${this.parsePrice(minRange)}`;
                } else {
                    result = this.parsePrice(minRange);
                }

            } else {
                maxRange = null;
                result = this.parsePrice(minRange);
            }
            return result;
        } else {
            return;
        }
    }

    getPriceObject(product: any) {
        let isRanged, isDiscounted = false;
        let {is_price, was_price} = product;
        let isPriceString, wasPriceString;
        is_price = is_price.split('-');
        was_price = was_price.split('-');
        if (is_price.length > 1) {
            isRanged = true;
            isPriceString = `${this.parsePrice(Number(is_price[0]))} - ${this.parsePrice(Number(is_price[1]))}`;
        } else {
            isPriceString = `${this.parsePrice(Number(is_price[0]))}`;
        }
        isDiscounted = was_price && Number(was_price[0]) > Number(is_price[0]);
        if (isDiscounted) {
            if (isRanged) {
                wasPriceString = `${this.parsePrice(Number(was_price[0]))} - ${this.parsePrice(Number(was_price[1]))}`;
            } else {
                wasPriceString = `${this.parsePrice(Number(was_price[0]))}`;
            }
        }
        return {isDiscounted, isRanged, isPriceString, wasPriceString};
    }

    updateLocalCart(quantityChange) {
        // tslint:disable-next-line: radix
        const localCartData = parseInt(localStorage.getItem('cart'));
        let quantity = quantityChange;
        if (typeof quantityChange === 'string') {
            // tslint:disable-next-line: radix
            quantity = parseInt(quantityChange);
        }
        const updateCartTotal = localCartData + quantity;
        localStorage.setItem('cart', updateCartTotal.toString());
    }

    isHandset(): Observable<BreakpointState> {
        return this.bpObserver;
    }

    parsePrice(price: number): string {
        const quotient = Math.floor(price);
        const remainder = Number((price - quotient).toPrecision(2));
        if (remainder === 0) {
            return this.formatUSCurrency(quotient, '1.0-0');
        } else {
            return this.formatUSCurrency(price, '1.2-2');
        }
    }

    formatUSCurrency(price: number, decimals) {
        return formatCurrency(price, 'en-US', getLocaleCurrencySymbol('en-US'), 'en-US', decimals);
    }

    getShippingDesc(product) {
        if (product.inventory_product_details) {
            return product.inventory_product_details.shipping_desc;
        }
        if (this.checkDataLength(product.variations)) {
            const variations = product.variations.filter(v => v.in_inventory);
            return variations[0].inventory_product_details.shipping_desc;
        }
    }
}
