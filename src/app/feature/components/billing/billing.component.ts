import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.less']
})
export class BillingComponent implements OnInit {
  name: string;
  address: string;
  constructor() {}

  ngOnInit() {}

  billing(name, address) {
    console.log(name, address);
  }
}
