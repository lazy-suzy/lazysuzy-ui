import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {WishlistSnackbarComponent} from '../../components/wishlist-snackbar/wishlist-snackbar.component';
import {ApiService, EventEmitterService, MatDialogUtilsService, UtilsService} from '..';
import {BreakpointState} from '@angular/cdk/layout';

@Injectable({
    providedIn: 'root'
})
export class WishlistSnackbarService {

    isHandset = false;
    guestWishlistedSku = [];

    constructor(
        private snackBar: MatSnackBar,
        private utils: UtilsService,
        private eventEmitterService: EventEmitterService,
        private apiService: ApiService,
    ) {
        this.utils.isHandset().subscribe((handset: BreakpointState) => {
            this.isHandset = handset.matches;
        });
    }

    addToWishlist(productSku) {
        const user = this.getCurrentUser();
        if (user.user_type === this.utils.userType.guest) {
            this.guestWishlistedSku.push(productSku);
            this.openGuestSnackbar();
        } else {
            this.openUserSnackbar();
        }

    }

    openGuestSnackbar() {
        const snackBarRef = this.snackBar.openFromComponent(WishlistSnackbarComponent, {
            panelClass: this.isHandset ? 'snackbar-container-handset' : 'snackbar-container',
            data: 'guest',
            duration: 5000
        });
        snackBarRef.onAction().subscribe(() => {
            this.utils.openSignupDialog(this.isHandset, true);
            this.eventEmitterService.userChangeEvent.asObservable().subscribe(user => {
                if (user.user_type > 0) {
                    this.markProductWishlisted();
                }
            });
        });
    }

    markProductWishlisted() {
        this.guestWishlistedSku.forEach(sku => {
            this.apiService
                .wishlistProduct(sku, true, this.isHandset).subscribe(value => {
            });
        });
        this.guestWishlistedSku = [];
    }

    openUserSnackbar() {
        const snackBarRef = this.snackBar.openFromComponent(WishlistSnackbarComponent, {
            panelClass: this.isHandset ? 'snackbar-container-handset' : 'snackbar-container',
            data: 'user',
            duration: 2000
        });
    }

    removeIfExistsProduct(sku) {
        const index = this.guestWishlistedSku.indexOf(sku);
        if (index !== -1) {
            this.guestWishlistedSku.splice(index, 1);
        }
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}
