import { Injectable, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ProductDetailsComponent,
  ConfirmCartProductComponent
} from 'src/app/feature/components';
import { SigninComponent, SignupComponent } from 'src/app/core/components';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MarkdownService } from 'ngx-markdown';
import {first, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MatDialogUtilsService {
  signupRef: ElementRef;
  readonly userType = {
    guest: 0,
    default: 1
  };

  constructor(
    public dialog: MatDialog,
    private location: Location,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private markdownService: MarkdownService
  ) { }

  closeDialogs() {
    this.dialog.closeAll();
  }

  openMatDialog(modalSku) {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '80%',
      height: '100%',
      data: { sku: modalSku },
      panelClass: 'product-details-dialog-container'
    });
    dialogRef.afterOpened().subscribe((result) => {
      this.location.go(`product/${modalSku}`, '', this.location.getState());
    });
    dialogRef.afterClosed().subscribe((result) => {
      const params = { ...this.activeRoute.snapshot.queryParams };
      if (params.modal_sku) {
        delete params.modal_sku;
        this.router.navigate([], { queryParams: params });
      } else {
        this.location.back();
      }
    });
  }

  openVariationDialog(modalSku) {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '80%',
      height: '100%',
      data: { sku: modalSku },
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
      const params = { ...this.activeRoute.snapshot.queryParams };
      if (params.modal_sku) {
        delete params.modal_sku;
        this.router.navigate([], { queryParams: params });
      } else {
        // this.location.back();
      }
    });
  }

  homepageMatDialog(modalSku) {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '80%',
      height: '100%',
      data: { sku: modalSku },
      panelClass: 'product-details-dialog-container'
    });
    dialogRef.afterOpened().subscribe((result) => {
      // this.location.go(`product/${modalSku}`);
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.location.go(``);
    });
  }

  openSignupDialog(isHandset = false, isClose = false) {
    const width = isHandset ? '100%' : '35%';
    // tslint:disable-next-line: no-unused-expression
    this.dialog.closeAll();
    setTimeout(()=>{
      this.dialog.open(SignupComponent, {
        width,
        panelClass: 'auth-dialog-container',
        autoFocus: false,
      });
    }, 100);
    return;
  }

  openSigninDialog(width = '35%') {
    this.dialog.closeAll();
    return this.dialog.open(SigninComponent, {
      width,
      panelClass: 'auth-dialog-container',
      autoFocus: false
    });
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
}
