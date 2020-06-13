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
      name: 'Arial',
      value: 'Arial'
    },
    {
      name: 'Allura',
      value: 'Allura'
    },
    {
      name: 'Amatic',
      value: 'Amatic'
    },
    {
      name: 'Courier New',
      value: 'Courier New'
    },
    {
      name: 'Garamond',
      value: 'Garamond'
    },
    {
      name: 'Georgia',
      value: 'Georgia'
    },
    {
      name: 'Helvetica',
      value: 'Helvetica'
    },
    {
      name: 'Italianno',
      value: 'Italianno'
    },

    {
      name: 'Montserrat',
      value: 'Montserrat'
    },

    {
      name: 'Open Sans',
      value: 'Open Sans'
    },
    {
      name: 'Roboto',
      value: 'Roboto'
    },
    {
      name: 'Times New Roman',
      value: 'Times New Roman'
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  selectFontFn(font) {
    this.selectFont.emit(font);
  }
}
