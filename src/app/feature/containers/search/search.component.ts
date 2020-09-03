import { COLORS } from "./../../../shared/constants";
import { Component, OnInit } from "@angular/core";
import {
  IProductsPayload,
  ISearchProduct,
  ISearchProductsPayload,
} from "./../../../shared/models";
import { ApiService } from "./../../../shared/services";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver,
} from "@angular/cdk/layout";
import { take } from "rxjs/operators";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.less"],
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
  totalCount = 0;
  bpSubscription: Subscription;
  isHandset: boolean;
  productsInRow = 2;
  isProductFetching = false;
  isBoardApi = false;
  searchKeywords = [];
  mustQueryParams = [];
  shouldQueryParams = [];
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.query = this.route.snapshot.queryParamMap.get("query");
    this.getSearchKeywords();
    this.route.queryParams.subscribe((params) => {
      this.query = params.query || "";
      this.getNewQueryResult();
    });

    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
  }

  onDestroy(): void {
    this.productsSubscription.unsubscribe();
    this.bpSubscription.unsubscribe();
  }

  getSearchKeywords() {
    this.apiService
      .getSearchKeywords()
      .pipe(take(1))
      .subscribe((data: any) => {
        this.searchKeywords = data;
        this.getNewQueryResult();
      });
  }

  createQueryParamsObject() {
    this.mustQueryParams = [];
    this.shouldQueryParams = [];
    let queries = this.query.split(" ");
    let fullQuery = queries.join("");
    const spareValues = this.createMustQuery(queries, fullQuery);
    if (!!spareValues.trim()) {
      this.createShouldQuery(queries, spareValues);
    } else {
      this.createShouldQuery(queries);
    }
  }

  //Form the Must Query
  createMustQuery(queries: string[], fullQuery: string): string {
    let color = [];
    let brand = [];
    let objectParam = [];
    let spareValues = [];
    queries.forEach((value) => {
      if (COLORS.indexOf(value) > -1) {
        color.push(value);
      } else if (this.searchKeywords.hasOwnProperty(value)) {
        objectParam.push(value);
      } else {
        spareValues.push(value);
      }
    });
    if (color.length > 0) {
      color.forEach((value) =>
        this.mustQueryParams.push({
          term: {
            color: value,
          },
        })
      );
    }
    if (objectParam.length > 0) {
      objectParam.forEach((value) => {
        this.mustQueryParams.push({
          term: {
            product_name: value,
          },
        });
      });
    }
    return spareValues.join(" ");
  }

  //Form the Should Query
  createShouldQuery(queries: string[], spareValue = "") {
    let shouldKeys = [];
    let keysWithSpareValues = [];
    queries
      .filter((value) => {
        if (COLORS.indexOf(value) > -1) {
          return false;
        }
        if (this.searchKeywords.hasOwnProperty(value)) {
          return true;
        }
        return false;
      })
      .forEach((filteredValue) => {
        shouldKeys = this.searchKeywords[filteredValue].filter(
          (value) => value != filteredValue
        );
      });
    let allKeys = [];
    if (spareValue != "") {
      keysWithSpareValues = shouldKeys.map((value) => `${spareValue} ${value}`);
      allKeys = [...shouldKeys, ...keysWithSpareValues];
    } else{
      allKeys=[...shouldKeys]
    }
      this.shouldQueryParams = allKeys.map((value) => {
        return {
          term: {
            product_name: value,
          },
        };
      });
    //this.shouldQueryParams = shouldKeys.filter(value=>)
    //  if (this.searchKeywords.hasOwnProperty(params)) {
    //    this.shouldQueryParams = this.searchKeywords[params]
    //      .filter((value) => value != params)
    //      .map((value) => {
    //        return {
    //          term: {
    //            product_name: value,
    //          },
    //        };
    //      });
    //  }
  }

  getNewQueryResult(): void {
    this.iPageNo = 0;
    this.iLimit = 24;
    this.createQueryParamsObject();
    const queryString = JSON.stringify({
      from: this.iPageNo * this.iLimit,
      size: this.iLimit,
      query: {
        bool: {
          must: this.mustQueryParams,
          should: this.shouldQueryParams,
        },
      },
    });
    console.log(queryString);
    this.productsSubscription = this.apiService
      .getSearchProducts(queryString)
      .subscribe((payload: ISearchProductsPayload) => {
        const { hits } = payload.hits;
        this.totalCount = hits.length;
        this.products = hits.map((hit: any) => hit._source);
      });
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
            query: this.query + "*",
          },
        },
      },
    });

    this.productsSubscription = this.apiService
      .getSearchProducts(queryString)
      .subscribe((payload: ISearchProductsPayload) => {
        const { hits } = payload.hits;
        this.totalCount = payload.hits.total.value;
        this.products = hits.map((hit: any) => hit._source);
      });
  }

  onScroll() {
    if (this.isProductFetching) {
      return;
    }
    this.iPageNo += 1;
    this.isProductFetching = true;

    // const queryString = JSON.stringify({
    //   from: this.iPageNo * this.iLimit,
    //   size: this.iLimit,
    //   query: {
    //     match: {
    //       name: {
    //         query: this.query + "*",
    //       },
    //     },
    //   },
    // });
    const queryString = JSON.stringify({
      from: this.iPageNo * this.iLimit,
      size: this.iLimit,
      query: {
        bool: {
          must: this.mustQueryParams,
          should: this.shouldQueryParams,
        },
      },
    });
    this.productsSubscription = this.apiService
      .getSearchProducts(queryString)
      .subscribe((payload: ISearchProductsPayload) => {
        const { hits } = payload.hits;
        this.products = [
          ...this.products,
          ...hits.map((hit: any) => hit._source),
        ];
        this.isProductFetching = false;
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
