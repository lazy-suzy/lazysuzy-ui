import { MOCK_PRODUCT } from './../../../mocks';
import { IProductPayload } from './../../../shared/models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less'],
})
export class ProductComponent implements OnInit {
  product: IProductPayload = MOCK_PRODUCT;
  constructor() {}

  ngOnInit() {}
}
