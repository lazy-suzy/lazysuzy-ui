import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-board-products',
  templateUrl: './board-products.component.html',
  styleUrls: ['./board-products.component.less', './../../board.component.less']
})
export class BoardProductsComponent implements OnInit {
  @Input() products: any = null;
  @Input() modifyPath: any = false;
  @Input() isAsset: any = false;
  productType = 'default';

  @Output() updates: EventEmitter<any> = new EventEmitter();
  @Output() previewProduct: EventEmitter<any> = new EventEmitter();
  activeItem: string;
  constructor() {}

  ngOnInit() {}

  onChanges(changes: any) {
    if (
      changes.products &&
      changes.products.previousValue !== changes.products.currentValue
    ) {
      const products = changes.products.currentValue || [];
      this.products = [...products] || [];
    }

    if (
      changes.isAsset &&
      changes.isAsset.previousValue !== changes.isAsset.currentValue
    ) {
      const isAsset = changes.isAsset.currentValue || [];
      this.isAsset = isAsset;
      if (this.isAsset) {
        this.productType = 'custom';
        this.products = this.transformAssetToProduct(this.products);
      }
    }
  }

  transformAssetToProduct(assets) {
    assets = assets.map((ast) => {
      const imagePath = environment.BASE_HREF + ast.path;
      return {
        ...ast,
        board_thumb: imagePath,
        dropType: 'custom'
      };
    });
    return assets;
  }

  previewProductFn(product) {
    this.activeItem = product.refId;
    this.previewProduct.emit(product);
  }
}
