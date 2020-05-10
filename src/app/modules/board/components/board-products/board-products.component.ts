import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board-products',
  templateUrl: './board-products.component.html',
  styleUrls: ['./board-products.component.less', './../../board.component.less']
})
export class BoardProductsComponent implements OnInit {

  @Input() products: any = [];
  @Input() modifyPath: any = false;
  @Input() isAsset: any = false;

  @Output() updates: EventEmitter<any> = new EventEmitter();
  @Output() previewProduct: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: any) {
    if (changes['products'] && changes['products'].previousValue !== changes['products'].currentValue) {
      let products = changes['products'].currentValue || [];
      this.products = [...products] || [];
    }

    if (changes['isAsset'] && changes['isAsset'].previousValue !== changes['isAsset'].currentValue) {
      let isAsset = changes['isAsset'].currentValue || [];
      this.isAsset = isAsset;
      if (this.isAsset) {
        this.products = this.transformAssetToProduct(this.products);
      }
    }
  }

  transformAssetToProduct(assets) {
    assets = assets.map(ast => {
      const baseImageUrl = '/assets/images/';
      return {
        ...ast,
        // main_image: baseImageUrl + ast.path,
        main_image: 'https://via.placeholder.com/150'
      };
    })
    return assets;
  }

  previewProductFn(product) {
    this.previewProduct.emit(product);
  }

}
