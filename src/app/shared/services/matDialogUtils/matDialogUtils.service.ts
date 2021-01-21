import {ElementRef, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmCartProductComponent, ProductDetailsComponent, ReviewFormComponent} from 'src/app/feature/components';
import {SigninComponent, SignupComponent} from 'src/app/core/components';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {OfferDailogComponent} from '../../../feature/components/offer-dailog/offer-dailog.component';
import {NewsletterPopupComponent} from '../../../feature/components/newsletter-popup/newsletter-popup.component';
import {CookieService} from 'ngx-cookie-service';

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
    productDialog;
    private payload: any;

    constructor(
        public dialog: MatDialog,
        private location: Location,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private cookie: CookieService
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
        if (this.productDialog) {
            this.productDialog.componentInstance.data = modalData;
        } else {
            this.productDialog = this.dialog.open(ProductDetailsComponent, {
                width: '80%',
                height: '100%',
                data: modalData,
                panelClass: 'product-details-dialog-container'
            });
            this.productDialog.afterOpened().subscribe((result) => {
                this.location.go(`product/${modalSku}`, '', this.location.getState());
            });
            this.productDialog.afterClosed().subscribe((result) => {
                this.payload = null;
                const params = {...this.activeRoute.snapshot.queryParams};
                this.productDialog = undefined;
                if (params.modal_sku) {
                    delete params.modal_sku;
                    this.router.navigate([], {queryParams: params});
                } else {
                    this.location.back();
                }
            });
        }

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
                isClose
            }
        });
        return this.signUpDialog;
    }

    openSigninDialog(width = '35%', isClose = false) {
        if (isClose && this.signUpDialog) {
            this.signUpDialog.close();
        }
        !isClose && this.dialog.closeAll();
        this.signInDialog = this.dialog.open(SigninComponent, {
            width,
            panelClass: 'auth-dialog-container',
            autoFocus: false,
            data: {
                isClose
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

    openNewsLetter(handset = false) {
        const config: any = {
            hasBackdrop: true,
            disableClose: true,
            data: {
                handset
            }
        };
        const dialogRef = this.dialog.open(NewsletterPopupComponent, config);
        dialogRef.afterClosed().subscribe(event => this.cookie.set('popupShow', '1', 1));
    }

    setProduct(payload) {
        this.payload = payload;
    }
	 
	openMyReviewDialog1(modal) { 
        const dialogRef = this.dialog.open(ReviewFormComponent, {
            width: '80%',
            height: '100%',
            data: {
                    modal,
                total: modal.price * modal.quantity
            },
            panelClass: 'product-details-dialog-container'
        });
    }

    openMyReviewDialog(modal) {
        console.log(modal);
        
     
       
        this.productDialog = this.dialog.open(ReviewFormComponent, {
            width: '80%',
            height: '100%',
            data: { modal },
                panelClass: 'product-details-dialog-container'
            });
            this.productDialog.afterOpened().subscribe((result) => {
                this.location.go(`product/review/${modal.sku}`, '', this.location.getState());
            });
            this.productDialog.afterClosed().subscribe((result) => {
                this.payload = null;
                const params = { ...this.activeRoute.snapshot.queryParams };
                this.productDialog = undefined;
                if (params.modal_sku) {
                    delete params.modal_sku;
                    this.router.navigate([], { queryParams: params });
                } else {
                    this.location.back();
                }
            });
        

    }
}
