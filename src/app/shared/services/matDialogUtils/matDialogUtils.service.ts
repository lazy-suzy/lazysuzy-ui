import {ElementRef, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmCartProductComponent, ProductDetailsComponent} from 'src/app/feature/components';
import {SigninComponent, SignupComponent} from 'src/app/core/components';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {MarkdownService} from 'ngx-markdown';
import {OfferDailogComponent} from '../../../feature/components/offer-dailog/offer-dailog.component';
import {NewsletterPopupComponent} from '../../../feature/components/newsletter-popup/newsletter-popup.component';

@Injectable({
    providedIn: 'root'
})
export class MatDialogUtilsService {
    signupRef: ElementRef;
    readonly userType = {
        guest: 0,
        default: 1
    };
    signUpDialog;
    signInDialog;
    private payload: any;

    constructor(
        public dialog: MatDialog,
        private location: Location,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private markdownService: MarkdownService
    ) {
    }

    closeDialogs() {
        this.dialog.closeAll();
    }

    openMatDialog(modalSku) {
        let modalData: any = {
            sku: modalSku,
        };
        if (this.payload && this.payload.product.sku === modalSku) {
            modalData = {...modalData, payload: this.payload};
        }
        const dialogRef = this.dialog.open(ProductDetailsComponent, {
            width: '80%',
            height: '100%',
            data: modalData,
            panelClass: 'product-details-dialog-container'
        });
        dialogRef.afterOpened().subscribe((result) => {
            this.location.go(`product/${modalSku}`, '', this.location.getState());
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.payload = null;
            const params = {...this.activeRoute.snapshot.queryParams};
            if (params.modal_sku) {
                delete params.modal_sku;
                this.router.navigate([], {queryParams: params});
            } else {
                this.location.back();
            }
        });
    }

    openVariationDialog(modalSku) {
        const dialogRef = this.dialog.open(ProductDetailsComponent, {
            width: '80%',
            height: '100%',
            data: {sku: modalSku},
            panelClass: 'product-details-dialog-container'
        });
        dialogRef.afterOpened().subscribe((result) => {
            this.location.replaceState(
                `product/${modalSku}`,
                '',
                this.location.getState()
            );
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.dialog.closeAll();
            const params = {...this.activeRoute.snapshot.queryParams};
            if (params.modal_sku) {
                delete params.modal_sku;
                this.router.navigate([], {queryParams: params});
            } else {
                // this.location.back();
            }
        });
    }

    homepageMatDialog(modalSku) {
        const dialogRef = this.dialog.open(ProductDetailsComponent, {
            width: '80%',
            height: '100%',
            data: {sku: modalSku},
            panelClass: 'product-details-dialog-container'
        });
        dialogRef.afterOpened().subscribe((result) => {
            this.location.go(`product/${modalSku}`);
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.location.back();
        });
    }

    openSignupDialog(isHandset = false, isClose = false) {
        const width = isHandset ? '100%' : '35%';
        // tslint:disable-next-line: no-unused-expression
        if (isClose && this.signInDialog) {
            this.signInDialog.close();
        }
        !isClose && this.dialog.closeAll();

        this.signUpDialog = this.dialog.open(SignupComponent, {
            width,
            panelClass: 'auth-dialog-container',
            autoFocus: false,
            data: {
                isClose: isClose
            }
        });
        return this.signUpDialog;
    }

    openSigninDialog(width = '35%', isClose = false) {
        if (isClose) {
            this.signUpDialog.close();
        }
        !isClose && this.dialog.closeAll();
        this.signInDialog = this.dialog.open(SigninComponent, {
            width,
            panelClass: 'auth-dialog-container',
            autoFocus: false,
            data: {
                isClose: isClose
            }
        });
        return this.signInDialog;
    }

    openAddToCartDialog(modal) {
        const dialogRef = this.dialog.open(ConfirmCartProductComponent, {
            width: '50%',
            height: '55%',
            data: {
                ...modal,
                total: modal.price * modal.quantity
            },
            panelClass: 'product-details-dialog-container'
        });
    }

    openAllOffersDialog(deals) {
        const dialogRef = this.dialog.open(OfferDailogComponent, {
            minWidth: '25%',
            hasBackdrop: false,
            data: {
                deals
            }
        });
    }

    openNewsLetter() {
        const dialogRef = this.dialog.open(NewsletterPopupComponent, {
            hasBackdrop: true,
            disableClose: true
        });
    }

    setProduct(payload) {
        this.payload = payload;
    }
}
