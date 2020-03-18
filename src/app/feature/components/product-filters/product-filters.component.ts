import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Options } from 'ng5-slider';
import { IFilterData } from 'src/app/shared/models';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.less']
})
export class ProductFiltersComponent {
  @Output() setFilters = new EventEmitter<any>();
  @Input() productFilters: IFilterData = {
    brand: [],
    type: [],
    color: [],
    category: [],
    price: { from: 0, min: 0, max: 0, to: 0 }
  };
  objectKeys = Object.keys;
  isClearAllVisible = false;
  activeFilters = {
    brand: [],
    price_from: 0,
    price_to: 0,
    type: [],
    color: [],
    category: []
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

  constructor(private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.isClearAllVisible = params['filters'] !== '';
    });
  }

  ngOnChanges(change: any) {
    if (change.productFilters.currentValue !== undefined) {
      this.productFilters = change.productFilters.currentValue;
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
      Math.round(this.minValue) === this.productFilters.price.from &&
      Math.round(this.maxValue) === this.productFilters.price.to
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
      color: [],
      category: []
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
}
