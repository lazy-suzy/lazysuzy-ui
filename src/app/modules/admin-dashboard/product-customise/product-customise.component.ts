import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../admin-dashboard.service';

@Component({
  selector: 'app-product-customise',
  templateUrl: './product-customise.component.html',
  styleUrls: ['./product-customise.component.scss']
})
export class ProductCustomiseComponent implements OnInit {

  positions = [
    { value: '0', viewValue: '0' },
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' }

  ];

  products = [
    { value: 'B1', viewValue: 'B1', images: [{}, {}, {}, {}] },
    { value: 'B2', viewValue: 'B2', images: [{}, {}, {}, {}] },
    { value: 'B1', viewValue: 'B1', images: [{}, {}, {}, {}] },
    { value: 'B2', viewValue: 'B2', images: [{}, {}, {}, {}] },
    { value: 'B1', viewValue: 'B1', images: [{}, {}, {}, {}] },
    { value: 'B2', viewValue: 'B2', images: [{}, {}, {}, {}] }
  ];

  allBoards = [
    { value: 'B1', viewValue: 'B1' },
    { value: 'B2', viewValue: 'B2' },
    { value: 'B3', viewValue: 'B3' },
    { value: 'B4', viewValue: 'B4' }
  ];

  constructor(private adminDashboardService: AdminDashboardService) { }

  ngOnInit() {
    this.adminDashboardService.getProducts("category", {}, "").subscribe(s => {
      this.products = s.products;
      debugger;
      this.products = this.products.map(pro => {
        return {
          ...pro,
          value: 'B2',
          viewValue: 'B2',
          images: [{}, {}, {}, {}]
        }
      });
    });
  }

  someMethod(item, value) {
    console.log(value, item);
  }

  handleUpdates(event) {
    console.log(event);
  }

}
