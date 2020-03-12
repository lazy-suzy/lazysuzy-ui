import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IProductPayload } from 'src/app/shared/models';
import { ApiService, UtilsService } from 'src/app/shared/services';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.less'],
})
export class ProductDetailsComponent implements OnInit {
  product: IProductPayload;
  productSubscription: Subscription;
  selectedIndex: number;
  dimensionExist: boolean;
  featuresExist: boolean;
  descriptionExist: boolean;
  variationsExist: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService, private utils: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.productSubscription = this.apiService
      .getProduct(this.data.sku)
      .subscribe((payload: IProductPayload) => {
        this.product = payload;
        this.dimensionExist = this.utils.checkDataLength(this.product.dimension);
        this.featuresExist = this.utils.checkDataLength(this.product.features);
        this.descriptionExist = this.utils.checkDataLength(this.product.description);
        this.variationsExist = this.utils.checkDataLength(this.product.variations);
      });

    }
  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  selectedVariation(variation, index, container) {
    if(variation.has_parent_sku){
      this.utils.openVariationDialog(variation.variation_sku)
    } else {
      this.product.thumb.splice(0,1,variation.image);
      this.selectedIndex = index;
      container.scrollTop = 0;
    }
  }
}
