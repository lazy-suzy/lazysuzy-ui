import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board-products',
  templateUrl: './board-products.component.html',
  styleUrls: ['./board-products.component.less', './../../board.component.less']
})
export class BoardProductsComponent implements OnInit {

  @Input() products: any = [];
  @Output() updates: EventEmitter<any> = new EventEmitter();
  @Output() previewProduct: EventEmitter<any> = new EventEmitter();
  @Input() modifyPath: any = false;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: any) {
    if (changes['products'] && changes['products'].previousValue !== changes['products'].currentValue) {
      let products = changes['products'].currentValue || [];
      // if (this.modifyPath) {
      //   products = products.map(pro => {
      //     return {
      //       ...pro,
      //       //TO ASK MIKE
      //       // main_image: `https://www.lazysuzy.com/${pro.path}`
      //       main_image: `http://board.lazysuzy.com/${pro.path}`
      //     };
      //   });
      // }
      this.products = [...products] || [];

    }
  }

  previewProductFn(product) {
    this.previewProduct.emit(product);
  }

}
