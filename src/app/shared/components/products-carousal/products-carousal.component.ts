import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-products-carousal',
  templateUrl: './products-carousal.component.html',
  styleUrls: ['./products-carousal.component.less']
})
export class ProductsCarousalComponent implements OnInit {
  carousalOptions = {
    margin: 10,
    loop: true,
    items: 1.25,
    dots: true,
    pagination: true,
    // autoWidth: true,
    // stagePadding: 100,
    singleItem: true
  };

  bannerCarousalOptions = {
    items: 1,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 8000,
    autoplayHoverPause: true,
    dots: true,
    pagination: true,
    smartSpeed: 1000,
    autoplaySpeed: 1000,
    loop: true,
    nav: true,
    navText: false
  };

  images = [];
  @Input() data: any = [];
  @Output() updates: EventEmitter<any> = new EventEmitter();

  @Input() isBanner: boolean = false;
  @Input() nameOfCarousal: string = '';

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (
      changes['data'] &&
      changes['data'].previousValue !== changes['data'].currentValue
    ) {
      this.data = changes['data'].currentValue;
    }
  }

  openDialog(sku) {
    this.updates.emit(sku);
  }
}
