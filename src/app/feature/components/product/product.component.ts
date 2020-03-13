import { ProductDetailsComponent } from './../product-details/product-details.component';
import { IProductPayload } from './../../../shared/models';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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
  modalSku: any;
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );

  bpSubscription: Subscription;
  numbOfSwatchItems: number;
  activeRouteSubscription: Subscription;
  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private location: Location,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

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
    // this.activeRouteSubscription = this.activeRoute.queryParams.subscribe(params => {

    // });
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
      height: '100%',
      data: { sku: this.product.sku },
      panelClass: 'product-details-dialog-container'
    });
    dialogRef.afterOpened().subscribe(result => {
      this.location.go(`product/${this.product.sku}`);
    });
    dialogRef.afterClosed().subscribe(result => {
      this.location.back();
    });
  }

  openSwatchDialog(variation): void {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '80%',
      height: '100%',
      panelClass: 'product-details-dialog-container',
      data: {
        sku: variation.has_parent_sku
          ? variation.variation_sku
          : variation.product_sku
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
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
