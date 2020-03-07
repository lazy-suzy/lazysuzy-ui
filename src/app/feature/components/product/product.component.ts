import { ProductDetailsComponent } from './../product-details/product-details.component';
import { IProductPayload } from './../../../shared/models';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {
  @Input() product: IProductPayload;
  starIcons: string[] = new Array();
  variationImage: string = '';
  isVariationImageVisible: boolean = false;
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );

  bpSubscription: Subscription;
  numbOfSwatchItems: number;

  constructor(public dialog: MatDialog, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.setRating();
    this.bpSubscription = this.breakpointObserver
    .observe([Breakpoints.Small])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.numbOfSwatchItems = 3;
      } else {
        this.numbOfSwatchItems = 6;
      }
    });
  }

  ngOnDestroy(): void {
    this.bpSubscription.unsubscribe();
  }

  setRating(): void {
    let starCount: number = Math.round(this.product.rating * 2) / 2;
    while (starCount > 0.5) {
      this.starIcons.push('star');
      starCount -= 1;
    }
    if (starCount && this.starIcons.length < 5) {
      this.starIcons.push('star_half');
    } else if (this.starIcons.length < 5) {
      while (this.starIcons.length < 5) {
        this.starIcons.push('star_outline');
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '80%',
      height: '80%',
      data: { sku: this.product.sku }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  openSwatchDialog(variation): void {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '80%',
      height: '80%',
      data: {
        sku: variation.has_parent_sku
          ? variation.variation_sku
          : variation.product_sku
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }
  showVariationImage(imageUrl): void {
    this.variationImage = imageUrl;
    this.isVariationImageVisible = true;
  }

  hideVariationImage(): void {
    this.variationImage = '';
    this.isVariationImageVisible = false;
  }
}
