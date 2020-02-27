import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ISortType } from 'src/app/shared/models';

@Component({
  selector: 'app-sort-type',
  templateUrl: './sort-type.component.html',
  styleUrls: ['./sort-type.component.less']
})
export class SortTypeComponent implements OnInit {
  @Output() setSortType = new EventEmitter<any>();
  @Input() sortTypeList: ISortType[];

  constructor() {}

  ngOnInit() {}
}
