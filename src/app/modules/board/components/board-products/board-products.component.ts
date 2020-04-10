import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board-products',
  templateUrl: './board-products.component.html',
  styleUrls: ['./board-products.component.less']
})
export class BoardProductsComponent implements OnInit {

  @Input() data: any = [];
  @Output() updates: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: any) {
    if (changes['data'] && changes['data'].previousValue !== changes['data'].currentValue) {
      this.data = changes['data'].currentValue || [];
    }
  }

}
