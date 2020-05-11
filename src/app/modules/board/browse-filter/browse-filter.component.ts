import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-browse-filter',
  templateUrl: './browse-filter.component.html',
  styleUrls: ['./browse-filter.component.less', '../board.component.less']
})
export class BrowsefilterComponent implements OnInit {

  showLoader: boolean = false;
  filterForm: any;

  someValue = 0;
  min = 0;
  max = 10000;

  brandsDropdown: any[];
  selectedbrandsDropdown: any[] = [];

  productsColors: any[];
  selectedProductsColor: any[] = [];

  @Output() updatesFromFilter: EventEmitter<any> = new EventEmitter();
  @Output() addProduct: EventEmitter<any> = new EventEmitter();
  @Input() filterData: any = {};

  constructor(
    private fb: FormBuilder
  ) { }

  clearAllFilters() {
    this.someValue = 0;
    this.min = 0;
    this.max = 10000;

    this.brandsDropdown = [];
    this.selectedbrandsDropdown = [];

    this.productsColors = [];
    this.selectedProductsColor = [];
  }

  ngOnChanges(changes: any) {
    if (changes['filterData'] && changes['filterData'].previousValue !== changes['filterData'].currentValue) {
      let filterData = changes['filterData'].currentValue || [];
      this.filterData = { ...filterData } || {};
      this.createForm(this.filterData);
    }
  }

  ngOnInit(): void { }

  convertFilterDataForPlugin(brand, color) {
    let brands = (brand || []).map(ele => {
      return {
        ...ele,
        label: ele.name,
      };
    });
    let colors = (color || []).map(ele => {
      return {
        ...ele,
        label: ele.name,
      };
    });
    return {
      brands: brands,
      colors: colors
    };
  }

  createForm(filterData) {
    const result = this.convertFilterDataForPlugin(filterData.brand, filterData.color);
    this.brandsDropdown = [...result.brands];
    this.productsColors = [...result.colors];
    this.filterForm = this.fb.group({
      brand: [],
      price: 0,
      color: []
    });
    this.filterForm.valueChanges.subscribe(val => {
      console.log("value", val);
    });
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    return value;
  }

  addProductToBoard(product) {
    this.addProduct.emit(product);
  }

  applyFilters() {
    const payload = {
      selectedbrands: this.selectedbrandsDropdown,
      selectedProducts: this.selectedProductsColor,
      price: this.someValue
    };
    this.updatesFromFilter.emit({
      name: 'APPLY_FILTERS',
      payload: payload
    });
  }

  cancelFilters() {
    this.updatesFromFilter.emit({
      name: 'CANCEL_FILTERS',
      payload: {}
    });
  }

  clearFilters() {
    this.clearAllFilters();
    this.updatesFromFilter.emit({
      name: 'CLEAR_FILTERS',
      payload: {}
    });
  }

}
