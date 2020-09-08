import { COLORS } from "./../../../shared/constants";
import { Component, OnInit, HostListener } from "@angular/core";
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
import { skip, map, switchMap, tap, first } from "rxjs/operators";

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
  brands: any;
  isIconShow = false;
  topPosToStartShowing = 300;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.query = this.route.snapshot.queryParamMap.get("query");
    this.getSearchKeywordsAndBrands();
    this.route.queryParams.pipe(skip(1)).subscribe((params) => {
      this.query = params.query || "";
      console.log(this.query);
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

  getSearchKeywordsAndBrands() {
    this.getSearchKeywords()
      .pipe(
        first(),
        tap((data: any) => (this.searchKeywords = data)),
        switchMap(() =>
          this.getBrands().pipe(
            first(),
            map((brands: any) => {
              return brands.map((brand) => {
                return {
                  name: brand.name,
                  value: brand.value,
                };
              });
            }),
            tap((data: any) => (this.brands = data))
          )
        )
      )
      .subscribe(() => {
        this.getNewQueryResult();
      });
  }
  getBrands() {
    return this.apiService.getBrands();
  }
  getSearchKeywords() {
    return this.apiService.getSearchKeywords();
    // .subscribe((data: any) => {
    //   this.searchKeywords = data;
    //   this.getNewQueryResult();
    // });
  }

  createQueryParamsObject() {
    this.mustQueryParams = [];
    this.shouldQueryParams = [];
    let queries = this.query.toLowerCase().split(" ");
    const spareValues = this.createMustQuery(queries);
    if (!!spareValues.trim()) {
      this.createShouldQuery(queries, spareValues);
    } else {
      this.createShouldQuery(queries);
    }
  }

  //Form the Must Query
  createMustQuery(queries: string[]): string {
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
    let spares = spareValues.join("");
    //  console.log(spares);
    this.brands.forEach((value) => {
      const brandName = value["name"].toLowerCase().replace(/\s+/g, "");
      let matcher = new RegExp(brandName);
      if (matcher.test(spares)) {
        brand.push(value);
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
    if (brand.length > 0) {
      brand.forEach((brand) => {
        this.mustQueryParams.push({
          term: {
            brand_name: brand.value,
          },
        });
      });
    }
    // if (objectParam.length > 0) {
    //   objectParam.forEach((value) => {
    //     this.mustQueryParams.push({
    //       term: {
    //         product_name: value,
    //       },
    //     });
    //   });
    // }
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
        // shouldKeys = this.searchKeywords[filteredValue].filter(
        //   (value) => value != filteredValue
        // );
        shouldKeys = this.searchKeywords[filteredValue];
      });
    let allKeys = [];
    if (spareValue != "") {
      keysWithSpareValues = shouldKeys.map((value) => `${spareValue} ${value}`);
      allKeys = [...shouldKeys, ...keysWithSpareValues];
    } else {
      allKeys = [...shouldKeys];
    }
    this.shouldQueryParams = allKeys.map((value,index) => {
      return {
        match: {
          name:{
            query:value,
            boost:allKeys.length-index
          }
        },
      };
    });
    this.shouldQueryParams.push({
        match: {
          name:{
            query:this.query,
          }
        },
      })
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
          minimum_should_match: 1,
        },
      },
    });
    console.log(queryString);
    this.productsSubscription = this.apiService
      .getSearchProducts(queryString)
      .subscribe((payload: ISearchProductsPayload) => {
        const { hits } = payload.hits;
        this.totalCount = payload.hits.total.value;
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

  @HostListener("window:scroll")
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isIconShow = scrollPosition >= this.topPosToStartShowing;
  }
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
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
