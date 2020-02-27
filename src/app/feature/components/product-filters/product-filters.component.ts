import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Options } from 'ng5-slider';
import { IFilterData } from 'src/app/shared/models';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.less']
})
export class ProductFiltersComponent {
  @Output() setFilters = new EventEmitter<any>();
  @Input() productFilters: IFilterData;
  objectKeys = Object.keys;
  activeFilters = {
    brand: [],
    price_from: 0,
    price_to: 0,
    type: [],
    color: []
  };
  minValue: number = 100;
  maxValue: number = 600;
  silderOptions: Options = {
    floor: 10,
    ceil: 500,
    translate: (value: number): string => {
      return '$' + value;
    }
  };

  ngOnChanges(change: any) {
    this.productFilters = change.productFilters.currentValue;
    if (this.productFilters) {
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
    }
    this.setFilters.emit(this.activeFilters);
  }

  onValueChange() {
    this.activeFilters.price_from = this.minValue;
    this.activeFilters.price_to = this.maxValue;
    this.setFilters.emit(this.activeFilters);
  }
}
