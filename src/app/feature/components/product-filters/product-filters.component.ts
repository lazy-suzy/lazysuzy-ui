import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IProductFilter } from 'src/app/shared/models';
import { MOCK_PRODUCT_FILTERS } from 'src/app/mocks';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.less'],
})
export class ProductFiltersComponent {
  @Output() setFilters = new EventEmitter<any>();
  productFilters: IProductFilter[] = MOCK_PRODUCT_FILTERS;
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
