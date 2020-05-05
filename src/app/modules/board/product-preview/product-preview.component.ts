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

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: any) {
    if (changes['data'] && changes['data'].previousValue !== changes['data'].currentValue) {
      this.data = changes['data'].currentValue || {};
    }
  }

  addToBoard(data) {
    this.addProductBoard.emit(data);
  }

  clearPreview(data){
    this.clearProductPreview.emit(data);
  }

}
