import { Component, OnInit } from '@angular/core';
import {
  IProductsPayload,
  ISearchProduct,
  ISearchProductsPayload
} from './../../../shared/models';
import { ApiService } from './../../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {
  query: string;
  iPageNo: number;
  iLimit: number;
  productsSubscription: Subscription;
  products: ISearchProduct[];
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );

  bpSubscription: Subscription;
  isHandset: boolean;
  productsInRow: number = 2;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.query = this.route.snapshot.queryParamMap.get('query');
    this.getQueryResult();
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      this.getQueryResult();
    });

    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
    this.bpSubscription.unsubscribe();
  }

  getQueryResult(): void {
    this.iPageNo = 0;
    this.iLimit = 24;
    const queryString = JSON.stringify({
      from: this.iPageNo * this.iLimit,
      size: this.iLimit,
      query: {
        match: {
          name: {
            query: this.query + '*'
          }
        }
      }
    });

    this.productsSubscription = this.apiService
      .getSearchProducts(queryString)
      .subscribe((payload: ISearchProductsPayload) => {
        const { hits } = payload.hits;
        this.products = hits.map((hit: any) => hit._source);
      });
  }

  toggleMobileView() {
    if (this.productsInRow === 3) {
      this.productsInRow = 1;
    } else {
      this.productsInRow += 1;
    }
  }
}
