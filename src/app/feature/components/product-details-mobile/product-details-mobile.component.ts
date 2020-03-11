import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProductPayload } from 'src/app/shared/models';
import { ApiService, UtilsService } from 'src/app/shared/services';
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

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private apiService: ApiService,
              private utils: UtilsService
  ) { }

  ngOnInit() {
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
    });
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  selectTab(tab) {
    this.activeTab = tab;
  }
}
