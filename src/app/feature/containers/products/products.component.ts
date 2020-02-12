import { Component, OnInit } from '@angular/core';
import { MOCK_PRODUCTS } from './../../../mocks';
import { IProductPayload } from './../../../shared/models';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less'],
})
export class ProductsComponent implements OnInit {
  products: IProductPayload[] = MOCK_PRODUCTS;

  ngOnInit(): void {}
}
