import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-board-text',
  templateUrl: './board-text.component.html',
  styleUrls: ['./board-text.component.less', './../../board.component.less']
})
export class BoardTextComponent implements OnInit {

  @Output() selectFont: EventEmitter<any> = new EventEmitter();

  allFonts = [{
    name: 'Helvetica',
    value: 'Helvetica'
  },
  {
    name: 'Times New Roman',
    value: 'Times New Roman'
  },
  {
    name: 'Courier New',
    value: 'Courier New'
  },
  {
    name: 'Georgia',
    value: 'Georgia'
  },
  {
    name: 'Arial',
    value: 'Arial',
  }];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void { }

  selectFontFn(font) {
    this.selectFont.emit(font);
  }

}
