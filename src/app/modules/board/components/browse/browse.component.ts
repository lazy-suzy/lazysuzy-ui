import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.less']
})
export class BrowseComponent implements OnInit {

  products = [];
  showLoader: boolean = false;
  filterForm: any;
  mockDataForProducts = [{
    DisplayDesc: 'DisplayDesc1',
    value: 'displayDesc1'
  },
  {
    DisplayDesc: 'DisplayDesc2',
    value: 'displayDesc2'
  }];

  mockDataForColor = [{
    DisplayDesc: 'DisplayDesc1',
    value: 'displayDesc1'
  },
  {
    DisplayDesc: 'DisplayDesc2',
    value: 'displayDesc2'
  }];

  someValue = 0;
  min = 0;
  max = 10000;

  @Output() updatesFromBrowse: EventEmitter<any> = new EventEmitter();
  @Output() addProduct: EventEmitter<any> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.apiService.getBrowseTabData('201').subscribe((s: any) => {
      this.products = s.products;
      this.showLoader = false;
    });
    this.createForm();
  }

  createForm() {
    this.filterForm = this.fb.group({
      brand: this.mockDataForProducts,
      price: 0,
      color: this.mockDataForColor
    });
    this.filterForm.valueChanges.subscribe(val => {
      debugger;
    });
  }

  addProductToBoard(product) {
    this.addProduct.emit(product);
  }

}
