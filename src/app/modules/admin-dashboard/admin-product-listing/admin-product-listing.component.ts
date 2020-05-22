import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-product-listing',
  templateUrl: './admin-product-listing.component.html',
  styleUrls: ['./admin-product-listing.component.css']
})
export class AdminProductListingComponent implements OnInit {

  @Input() allBoards: any = [];
  @Input() positions: any = [];
  @Input() products: any = [];

  @Output() updates: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: any) {
    if (changes['allBoards'] && changes['allBoards'].previousValue !== changes['allBoards'].currentValue) {
      let allBoards = changes['allBoards'].currentValue || [];
      this.allBoards = [...allBoards] || [];
    }
    if (changes['positions'] && changes['positions'].previousValue !== changes['positions'].currentValue) {
      let positions = changes['positions'].currentValue || [];
      this.positions = [...positions] || [];
    }
    if (changes['products'] && changes['products'].previousValue !== changes['products'].currentValue) {
      let products = changes['products'].currentValue || [];
      this.products = [...products] || [];
    }
  }

  currentEditingProduct: any = {};
  currentEditingValue: any = "";

  someMethod(item, value) {
    // this.updates.emit({
    //   data: {
    //     value: value,
    //     item: item
    //   }
    // });
    this.currentEditingProduct = { ...item };
    this.currentEditingValue = value;
    // console.log(value, item);
  }

  cancelEdit() {
    this.currentEditingProduct = {};
  }

  saveEdit() {
    this.updates.emit({
      data: {
        value: this.currentEditingValue,
        item: this.currentEditingProduct
      }
    });
    // Reset Product
  }

}
