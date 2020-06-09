import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-board-text',
  templateUrl: './board-text.component.html',
  styleUrls: ['./board-text.component.less', './../../board.component.less']
})
export class BoardTextComponent implements OnInit {
  @Output() selectFont: EventEmitter<any> = new EventEmitter();

  allFonts = [
    {
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
      value: 'Arial'
    },
    {
      name: 'Garamond',
      value: 'Garamond'
    },
    {
      name: 'Montserrat',
      value: 'Montserrat'
    },
    {
      name: 'Roboto',
      value: 'Roboto'
    },
    {
      name: 'Amatic',
      value: 'Amatic'
    },
    {
      name: 'Allura',
      value: 'Allura'
    },
    {
      name: 'Italianno',
      value: 'Italianno'
    },
    {
      name: 'Open Sans',
      value: 'Open Sans'
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  selectFontFn(font) {
    this.selectFont.emit(font);
  }
}
