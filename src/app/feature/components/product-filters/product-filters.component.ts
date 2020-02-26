import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { IFilterData } from 'src/app/shared/models';
import { IBrand } from 'src/app/shared/models/brand.interface';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.less']
})
export class ProductFiltersComponent {
  @Output() setFilters = new EventEmitter<any>();
  @Input() productFilters: IFilterData;
  objectKeys = Object.keys;
  activeFilters = { brand: [], price: [], type: [], color: [] };

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
    this.setFilters.emit(this.activeFilters);
  }
}
