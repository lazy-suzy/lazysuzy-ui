import { Injectable, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from 'src/app/feature/components';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MarkdownService } from 'ngx-markdown';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  signupRef: ElementRef;

  constructor(
    public dialog: MatDialog,
    private location: Location,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private markdownService: MarkdownService
  ) {}

  setSignupRef(ref) {
    this.signupRef = ref;
  }

  openSignup() {
    this.signupRef.nativeElement.click();
  }

  checkDataLength(data) {
    if (Array.isArray[data]) {
      return data.length > 0 && data[0].length > 0;
    }
    return data.length > 0;
  }

  openMatDialog(modalSku) {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '80%',
      height: '100%',
      data: { sku: modalSku },
      panelClass: 'product-details-dialog-container'
    });
    dialogRef.afterOpened().subscribe(result => {
      this.location.go(`product/${modalSku}`, '', this.location.getState());
    });
    dialogRef.afterClosed().subscribe(result => {
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
    dialogRef.afterOpened().subscribe(result => {
      this.location.replaceState(
        `product/${modalSku}`,
        '',
        this.location.getState()
      );
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialog.closeAll();
      const params = { ...this.activeRoute.snapshot.queryParams };
      if (params.modal_sku) {
        delete params.modal_sku;
        this.router.navigate([], { queryParams: params });
      } else {
        this.location.back();
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
    dialogRef.afterOpened().subscribe(result => {
      this.location.go(`product/${modalSku}`);
    });
    dialogRef.afterClosed().subscribe(result => {
      this.location.go(``);
    });
  }

  compileMarkdown(data) {
    return this.markdownService.compile(data.join('<br/>'));
  }
}
