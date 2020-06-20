import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-product-listing',
  templateUrl: './admin-product-listing.component.html',
  styleUrls: ['./admin-product-listing.component.less']
})
export class AdminProductListingComponent implements OnInit {
  @Input() allBoards: any = [];
  @Input() positions: any = [];
  @Input() products: any = [];

  @Output() tagImage: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  handleTagChange(productSku, image, value) {
    this.tagImage.emit({
      productSku,
      image,
      type: value
    });
  }
}
