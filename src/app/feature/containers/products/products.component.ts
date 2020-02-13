import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProductPayload, IProductsPayload } from './../../../shared/models';
import { ApiService } from './../../../shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  productsSubscription: Subscription;
  products: IProductPayload[];
  department: string;
  category: string;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getParams();
    this.productsSubscription = this.apiService
      .getProducts(this.department, this.category)
      .subscribe((payload: IProductsPayload) => {
        this.products = payload.products;
      });
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  getParams(): void {
    const urlParams: string[] = this.router.url.split('/').slice(1);
    this.department = urlParams[1];
    this.category = urlParams[2];
  }
}
