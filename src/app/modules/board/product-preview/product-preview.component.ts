import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.less', '../board.component.less']
})
export class AppProductPreviewComponent implements OnInit {

  @Input() data: any = {};
  @Output() addProductBoard: EventEmitter<any> = new EventEmitter();
  @Output() clearProductPreview: EventEmitter<any> = new EventEmitter();
  dropType = 'default';
  minPrice: number;
  maxPrice: number;
  constructor() { }

  ngOnInit() {
    this.updatePriceFormat(this.data.is_price, this.data.price);
   }

  ngOnChanges(changes: any) {
    if (changes['data'] && changes['data'].previousValue !== changes['data'].currentValue) {
      this.data = changes['data'].currentValue || {};
      this.updatePriceFormat(this.data.is_price, this.data.price);
      if(this.data.dropType){
        this.dropType = this.data.dropType;
      }
    }
  }

  addToBoard(data) {
    this.addProductBoard.emit(data);
  }

  clearPreview(data){
    this.clearProductPreview.emit(data);
  }

  updatePriceFormat(price, searchProductsPrice) {
    let data = price || searchProductsPrice;
    let splitedPrice = data.split('-');
    this.minPrice = splitedPrice[0];
    if(splitedPrice.length > 1) {
      this.maxPrice = splitedPrice[1];
    } else {
      this.maxPrice = null;
    }
  }

}
