import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Options } from 'ng5-slider';
import { IFilterData, IProductFilterOption, IProductFilter, IProductsPayload } from 'src/app/shared/models';

@Component({
  selector: 'app-product-filter-mobile',
  templateUrl: './product-filter-mobile.component.html',
  styleUrls: ['./product-filter-mobile.component.less']
})
export class ProductFilterMobileComponent implements OnInit {
  @Output() setMobileToggle = new EventEmitter<any>();
  @Output() setFilters = new EventEmitter<any>();
  @Input() productFilters: any;
  @Input() totalCount: number;
  @Input() isProductFetching: boolean;
  objectKeys = Object.keys;
  isClearAllVisible = false;
  activeFilters = {
    brand: [],
    price_from: 0,
    price_to: 0,
    type: [],
    color: []
  };
  isPriceChanged: boolean = false;
  minValue: number = 100;
  maxValue: number = 600;
  silderOptions: Options = {
    floor: 10,
    ceil: 500,
    translate: (value: number): string => {
      return '$' + value;
    }
  };
  activeTab: string = 'brand';
  activeFilterTabData: any;
  clearOptionVisible = {
    brand: false,
    color: false,
    type: false,
    price: true
  };
  constructor(private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    this.selectTab(this.activeTab);
    this.activeRoute.queryParams.subscribe(params => {
      this.isClearAllVisible = params['filters'] !== '';
    });
  }

  ngOnChanges(change: any) {
    if (change.productFilters !== undefined) {
      this.productFilters = change.productFilters.currentValue;
      this.selectTab(this.activeTab);
      if (this.productFilters && !this.isPriceChanged) {
        this.minValue = this.productFilters.price.from;
        this.maxValue = this.productFilters.price.to;
        this.silderOptions = {
          floor: this.productFilters.price.min,
          ceil: this.productFilters.price.max,
          translate: (value: number): string => {
            return '$' + value;
          }
        };
        this.activeFilters.price_from = this.minValue;
        this.activeFilters.price_to = this.maxValue;
        this.activeFilters.brand = this.productFilters.brand
          .filter(brand => brand.checked)
          .map(brand => brand.value);
        this.activeFilters.type = this.productFilters.type
          .filter(type => type.checked)
          .map(type => type.value);
        this.activeFilters.color = this.productFilters.color
          .filter(color => color.checked)
          .map(color => color.value);
      }
    }
  }

  onCheckChange(event, filter: string) {
    const option: string = event.source.value;
    if (event.source.checked) {
      this.activeFilters[filter].push(option);
    } else {
      const optionsArr = this.activeFilters[filter].filter(
        (value: string) => value !== option
      );
      this.activeFilters[filter] = optionsArr;
    }
    if (
      this.minValue === this.productFilters.price.from &&
      this.maxValue === this.productFilters.price.to
    ) {
      delete this.activeFilters.price_from;
      delete this.activeFilters.price_to;
      this.isPriceChanged = false;
    } else {
      this.isPriceChanged = true;
    }
    this.setFilters.emit(this.activeFilters);
  }

  clearFilters() {
    this.activeFilters = {
      brand: [],
      price_from: 0,
      price_to: 0,
      type: [],
      color: []
    };
    this.clearOptionVisible = {
      brand: false,
      color: false,
      type: false,
      price: true
    };
    delete this.activeFilters.price_from;
    delete this.activeFilters.price_to;
    this.isPriceChanged = false;
    this.setFilters.emit(this.activeFilters);
  }

  onPriceChange() {
    this.activeFilters.price_from = this.minValue;
    this.activeFilters.price_to = this.maxValue;
    this.isPriceChanged = true;
    this.setFilters.emit(this.activeFilters);
  }

  closeFilters() {
    this.setMobileToggle.emit();
  }

  selectTab(filter) {
    this.activeTab = filter;
    if (filter !== 'price') {
      this.showClearBtn(this.productFilters[filter].filter(this.ifChecked), filter);
      this.activeFilterTabData = this.productFilters[filter].filter(this.checkEnabled);
    } else {
      this.activeFilterTabData = null;
    }
  }

  disableTab(filter) {
    if (filter !== 'price') {
      return this.productFilters[filter].filter(this.checkEnabled).length === 0;
    } else {
      return false;
    }
  }

  checkEnabled(data) {
    return data.enabled;
  }

  ifChecked(data) {
    return data.checked;
  }

  showClearBtn(data,filter) {
    this.clearOptionVisible[filter] = data.length > 0;
  }

  clearBtn(activeFilter) {
    if (activeFilter === 'price') {
      this.activeFilters. price_from = 0;
      this.activeFilters. price_to = 0;
      delete this.activeFilters.price_from;
      delete this.activeFilters.price_to;
      this.isPriceChanged = false;
    } else {
      this.activeFilters[activeFilter] = [];
      this.clearOptionVisible[activeFilter] = false;
    }
    this.setFilters.emit(this.activeFilters);
  }

}
