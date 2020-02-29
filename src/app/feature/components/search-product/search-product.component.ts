import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from './../product-details/product-details.component';
import { ISearchProduct } from './../../../shared/models';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.less']
})
export class SearchProductComponent implements OnInit {
  @Input() product: ISearchProduct;
  starIcons: string[] = new Array();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.product.main_product_images =
      '//www.lazysuzy.com' + this.product.main_product_images;
    this.setRating();
  }

  setRating(): void {
    console.log(this.product);
    let starCount: number = Math.round(parseFloat(this.product.rating) * 2) / 2;
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
      data: { sku: this.product.product_sku }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }
}