import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class LoaderComponent implements OnInit {

  @Input() showProgressBar: any = false;

  constructor() {}

  ngOnInit(): void {
  }

}
