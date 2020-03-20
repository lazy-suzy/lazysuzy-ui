import { ProductDetailsComponent } from './../product-details/product-details.component';
import { IProductPayload } from './../../../shared/models';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-product-mobile',
  templateUrl: './product-mobile.component.html',
  styleUrls: ['./product-mobile.component.less']
})
export class ProductMobileComponent implements OnInit {
  @Input() product: IProductPayload;
  @Input() productsInRow: number;

  constructor(private apiService: ApiService) {}

  ngOnInit() {}
  wishlistProduct(sku, mark, event) {
    event.stopPropagation();
    this.apiService.wishlistProduct(sku, mark).subscribe((payload: any) => {
      this.product.wishlisted = mark;
    });
  }
}
