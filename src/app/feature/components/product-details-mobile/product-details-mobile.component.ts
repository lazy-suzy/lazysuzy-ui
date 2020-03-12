import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IProductPayload } from 'src/app/shared/models';
import { ApiService, UtilsService } from 'src/app/shared/services';
import { Observable, Subscription } from 'rxjs';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-product-details-mobile',
  templateUrl: './product-details-mobile.component.html',
  styleUrls: ['./product-details-mobile.component.less']
})
export class ProductDetailsMobileComponent implements OnInit {
  productSku: any;
  routeSubscription: any;
  product: IProductPayload;
  productSubscription: Subscription;
  activeTab: string = 'desc';
  dimensionExist: boolean = false;
  featuresExist: boolean = false;
  descriptionExist: boolean = false;
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );

  bpSubscription: Subscription;
  isHandset: boolean;
  variationsExist: boolean;
  selectedIndex: any;
  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private apiService: ApiService,
              private utils: UtilsService,
              private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    this.loadProduct();
  }

  loadProduct() {
    this.routeSubscription = this.activeRoute.params.subscribe(routeParams => {
      this.productSku = routeParams.product;
    });
    this.productSubscription = this.apiService
      .getProduct(this.productSku)
      .subscribe((payload: IProductPayload) => {
        this.product = payload;
        this.dimensionExist = this.utils.checkDataLength(this.product.dimension);
        this.featuresExist = this.utils.checkDataLength(this.product.features);
        this.descriptionExist = this.utils.checkDataLength(this.product.description);
        this.variationsExist = this.utils.checkDataLength(this.product.variations);
        if (!this.isHandset) {
          this.router.navigate([`${this.product.department_info[0].category_url}`], {queryParams: {modal_sku: this.product.sku}});
        }
    });
  }
  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
    this.bpSubscription.unsubscribe();
  }

  selectTab(tab) {
    this.activeTab = tab;
  }

  selectedVariation(variation, index, container) {
    if(variation.has_parent_sku){
      this.router.navigate([`/product/${variation.variation_sku}`]);
      this.loadProduct();
    } else {
      this.product.thumb.splice(0,1,variation.image);
      this.selectedIndex = index;
      container.scrollLeft = 0;
    }
  }
}
