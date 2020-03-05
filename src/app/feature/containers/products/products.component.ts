import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProductPayload, IProductsPayload } from './../../../shared/models';
import { ApiService } from './../../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnInit, OnDestroy {
  productsSubscription: Subscription;
  products: IProductPayload[];
  department: string;
  category: string;
  filters = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.activeRoute.params.subscribe(routeParams => {
      this.department = routeParams.department;
      this.category = routeParams.category;
      this.loadProducts();
    });
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  getParams(): void {
    const urlParams: string[] = this.router.url.split('/').slice(1);
    this.department = urlParams[1];
    this.category = urlParams[2];
  }

  loadProducts(): void {
    this.productsSubscription = this.apiService
      .getProducts(this.department, this.category)
      .subscribe((payload: IProductsPayload) => {
        this.products = payload.products;
      });
  }

  onSetFilters(e): void {
    const filters = this.buildFilters(e);
    console.log("filters", filters);
    this.productsSubscription = this.apiService
      .getProducts(this.department, this.category, filters)
      .subscribe((payload: IProductsPayload) => {
        this.products = payload.products;                                                                                           
      });
  }

  buildFilters(event: string): string {
    let tempFilters = '';
    for (let [filter, options] of Object.entries(event)) {
      tempFilters += options.length ? `${filter}:${options};` : `${filter}:;`;
    }
    return tempFilters;
  }
}
