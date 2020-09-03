import { Component, OnInit, Input } from '@angular/core';
import {
  ApiService,
  MatDialogUtilsService,
  UtilsService
} from 'src/app/shared/services';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.component.html',
  styleUrls: ['./sets.component.less']
})
export class SetsComponent implements OnInit {
  @Input() sets = [];
  @Input() brand: string;
  @Input() isHandset = false;

  constructor(
    private apiService: ApiService,
    private matDialogUtils: MatDialogUtilsService,
    public utils: UtilsService
  ) {}

  ngOnInit() {}

  openLink(event, url) {
    event.preventDefault();
    if (typeof vglnk) {
      vglnk.open(url, '_blank');
    }
  }
  openCartModal(item, index) {
    const data = {
      sku: item.sku,
      brand: this.brand,
      image: item.image,
      name: item.name,
      price: item.inventory_product_details.price,
      quantity: 1
    };
    const postData = {
      product_sku: item.sku,
      count: 1
    };
    this.apiService.addCartProduct(postData).subscribe(
      (payload: any) => {
        if (payload.status) {
          this.matDialogUtils.openAddToCartDialog(data);
        } else {
          this.sets[index].errorMessage = payload.msg;
        }
      },
      (error: any) => {
        this.sets[index].errorMessage =
          'Cannot add this product at the moment.';
        console.log(error);
      }
    );
  }
}
