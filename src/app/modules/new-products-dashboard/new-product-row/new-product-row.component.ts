import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-new-product-row',
  templateUrl: './new-product-row.component.html',
  styleUrls: ['./new-product-row.component.less']
})
export class NewProductRowComponent implements OnInit {
  
  @Input() product: any = {};
  @Input() index = 1;
  constructor() { }

  ngOnInit() {
  }

}
