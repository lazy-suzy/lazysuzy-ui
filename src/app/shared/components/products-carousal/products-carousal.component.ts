import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-products-carousal',
  templateUrl: './products-carousal.component.html',
  styleUrls: ['./products-carousal.component.less'],
})
export class ProductsCarousalComponent implements OnInit {

  carousalOptions = {
      margin: 10,
      loop: true,
      items: 1,
      stagePadding: 100
  };

  images = [
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_bags.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_book_cover.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_bags.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_book_cover.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_bags.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_book_cover.jpg"
  ];
  
  @Input() data: any = [];

  constructor(  ) {
  
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes["data"] && (changes["data"].previousValue !== changes["data"].currentValue)) {
      this.data = changes["data"].currentValue;
    }
  }



}
