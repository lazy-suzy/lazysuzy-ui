import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-attribute-filters',
  templateUrl: './attribute-filters.component.html',
  styleUrls: ['./attribute-filters.component.less']
})
export class AttributeFiltersComponent implements OnInit {

  @Input() product:any
  @Input() filterLabel:any
  @Input() filterValues:any
  constructor() { }

  ngOnInit() {
  }

}
