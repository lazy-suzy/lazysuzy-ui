import { ApiService } from './../../../shared/services/api/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less'],
})
export class ProductsComponent implements OnInit {
  // constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // this.apiService.getProducts('living', 'chairs');
    // category: string,
    // subCategory: string,
    // page = 0
  }
}
