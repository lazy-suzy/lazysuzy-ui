import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.less']
})
export class DeliveryDetailsComponent implements OnInit {
  @Input() isHandset = false;
  constructor() { }

  ngOnInit() {
  }

}
