import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ISortType } from 'src/app/shared/models';

@Component({
  selector: 'app-product-sort-mobile',
  templateUrl: './product-sort-mobile.component.html',
  styleUrls: ['./product-sort-mobile.component.less']
})
export class ProductSortMobileComponent implements OnInit {
  @Output() setSortToggle = new EventEmitter<any>();
  @Output() setSortType = new EventEmitter<any>();
  @Input() sortTypeList: ISortType[];
  default = 'recommended';

  constructor() {}

  ngOnInit() {}

  sortChanged(event, value) {
    this.closeSort();
    event.value = value;
    this.setSortType.emit(event.value);
  }

  closeSort() {
    this.setSortToggle.emit();
  }
}
