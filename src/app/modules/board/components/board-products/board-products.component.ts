import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board-products',
  templateUrl: './board-products.component.html',
  styleUrls: ['./board-products.component.less']
})
export class BoardProductsComponent implements OnInit {

  @Input() products: any = [];
  @Output() updates: EventEmitter<any> = new EventEmitter();
  @Output() previewProduct: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: any) {
    if (changes['products'] && changes['products'].previousValue !== changes['products'].currentValue) {
      this.products = changes['products'].currentValue || [];
    }
  }

  previewProductFn(product) {
    this.previewProduct.emit(product);
  }

}
