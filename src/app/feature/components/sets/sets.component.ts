import { Component, OnInit, Input } from '@angular/core';
import { ApiService, UtilsService } from 'src/app/shared/services';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.component.html',
  styleUrls: ['./sets.component.less']
})
export class SetsComponent implements OnInit {
  @Input() sets = [];
  @Input() brand: string;

  constructor(private apiService: ApiService, private utils: UtilsService) {}

  ngOnInit() {}

  openLink(event, url) {
    event.preventDefault();
    if (typeof vglnk) {
      vglnk.open(url, '_blank');
    }
  }
  openCartModal(item) {
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
        this.utils.openAddToCartDialog(data);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
