import { ProductDetailsComponent } from './../product-details/product-details.component';
import { IProductPayload } from './../../../shared/models';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-mobile',
  templateUrl: './product-mobile.component.html',
  styleUrls: ['./product-mobile.component.less']
})
export class ProductMobileComponent implements OnInit {
  @Input() product: IProductPayload;
  @Input() productsInRow: number;

  constructor() { }

  ngOnInit() {
  }

}
