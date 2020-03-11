import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IProductPayload } from 'src/app/shared/models';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.less'],
})
export class ProductDetailsComponent implements OnInit {
  product: IProductPayload;
  productSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.productSubscription = this.apiService
      .getProduct(this.data.sku)
      .subscribe((payload: IProductPayload) => {
        this.product = payload;
      });

    }
  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }
}
