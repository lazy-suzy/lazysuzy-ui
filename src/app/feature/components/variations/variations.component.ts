import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-variations',
  templateUrl: './variations.component.html',
  styleUrls: ['./variations.component.less']
})
export class VariationsComponent implements OnInit {
  @Input() variations = [];
  constructor() {}

  ngOnInit() {}
}
