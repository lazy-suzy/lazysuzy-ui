import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.less']
})
export class TextComponent implements OnInit {

  @Output() updates: EventEmitter<any> = new EventEmitter();

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
    value: 'Arial'
  }];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void { }

  selectFont(font) {
    this.updates.emit(font);
  }

}
