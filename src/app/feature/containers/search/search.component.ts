import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  IProductsPayload,
  IProduct
} from './../../../shared/models';
import { ApiService } from './../../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
})
export class SearchComponent implements OnInit {
  query: string;
  iPageNo: number;
  iLimit: number;
  productsSubscription: Subscription;
  products: IProduct[];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.query = this.route.snapshot.queryParamMap.get('query');
    this.getQueryResult();
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      this.getQueryResult();
    });
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  getQueryResult() {
    this.iPageNo = 0;
    this.iLimit = 24;
    const queryString = JSON.stringify({
      from: this.iPageNo * this.iLimit,
      size: this.iLimit,
      query: {
        match: {
          name: {
            query: this.query + '*',
          },
        },
      },
    });
    this.productsSubscription = this.apiService
      .getSearchProducts(queryString)
      .subscribe((payload: IProductsPayload) => {
        this.products = payload.products;
      });
  }
}
