import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-product-listing',
  templateUrl: './admin-product-listing.component.html',
  styleUrls: ['./admin-product-listing.component.css']
})
export class AdminProductListingComponent implements OnInit {

  states = [
    { value: 'state-1', viewValue: 'State One' },
    { value: 'state-2', viewValue: 'State Two' },
    { value: 'state-3', viewValue: 'State Three' }
  ];

  constructor() { }

  ngOnInit() { }

  someMethod(item,value) {
    console.log(value, item);
  }

}
