import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-about-small',
  templateUrl: './about-small.component.html',
  styleUrls: ['./about-small.component.less']
})
export class AboutSmallComponent implements OnInit {
  @Input() isHandset = false;
  constructor() { }

  ngOnInit() {
  }

}
