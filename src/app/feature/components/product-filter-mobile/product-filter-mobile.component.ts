import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Options} from 'ng5-slider';
import {
    IFilterData,
    IProductFilterOption,
    IProductFilter,
    IProductsPayload
} from 'src/app/shared/models';
import {isArray} from 'util';

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
        category: [],
        shape: [],
        seating: [],
        color: [],
        height_from: [],
        height_to: [],
        width_from: [],
        width_to: [],
        length_from: [],
        length_to: [],
        diameter_from: [],
        diameter_to: [],
        square_from: [],
        square_to: [],
        depth_from: [],
        depth_to: [],
        depth: [],
        height: [],
        width: [],
        length: [],
        diameter: [],
        square: [],
    };
    dimensionFilters = [
        'height',
        'width',
        'length',
        'diameter',
        'square',
        'depth'
    ];
    dimensionFilterValueStore = [
        'height_from',
        'height_to',
        'width_from',
        'width_to',
        'length_from',
        'length_to',
        'diameter_from',
        'diameter_to',
        'square_from',
        'square_to',
        'depth_from',
        'depth_to',
    ];
    isPriceChanged = false;
    minValue = 100;
    maxValue = 600;
    silderOptions: Options = {
        floor: 10,
        ceil: 500,
        translate: (value: number) => {
            return '$' + value;
        }
    };
    activeTab = 'brand';
    activeFilterTabData: any;
    clearOptionVisible = {
        brand: false,
        color: false,
        type: false,
        price: true
    };

    constructor(private activeRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.selectTab(this.activeTab);
        this.activeRoute.queryParams.subscribe((params) => {
            this.isClearAllVisible = params.filters !== '';
        });
    }

    // tslint:disable-next-line: use-lifecycle-interface
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
                    translate: (value: number) => {
                        return '$' + value;
                    }
                };
                this.activeFilters.price_from = this.minValue;
                this.activeFilters.price_to = this.maxValue;
                this.activeFilters.brand = this.productFilters.brand
                    .filter((brand) => brand.checked)
                    .map((brand) => brand.value);
                this.activeFilters.type = this.productFilters.type
                    .filter((type) => type.checked)
                    .map((type) => type.value);
                this.activeFilters.color = this.productFilters.color
                    .filter((color) => color.checked)
                    .map((color) => color.value);
                if (this.productFilters.seating) {
                    this.activeFilters.seating = this.productFilters.seating
                        .filter((seating) => seating.checked)
                        .map((seating) => seating.value);
                }
                if (this.productFilters.shape) {
                    this.activeFilters.shape = this.productFilters.shape
                        .filter((shape) => shape.checked)
                        .map((shape) => shape.value);
                }
                if (this.productFilters.category) {
                    this.activeFilters.category = this.productFilters.category
                        .filter((category) => category.checked)
                        .map((category) => category.value);
                }
                if (this.productFilters.height) {
                    const activeFilterValues = this.productFilters.height[0].values
                        .filter((enabled) => enabled.checked);
                    this.activeFilters.height = activeFilterValues.map(value => this.renderOptions(value));
                    this.activeFilters.height_from = activeFilterValues.map(value => value.min);
                    this.activeFilters.height_to = activeFilterValues.map(value => value.max);
                }
                if (this.productFilters.width) {
                    const activeFilterValues = this.productFilters.width[0].values
                        .filter((enabled) => enabled.checked);
                    this.activeFilters.width = activeFilterValues.map(value => this.renderOptions(value));
                    this.activeFilters.width_from = activeFilterValues.map(value => value.min);
                    this.activeFilters.width_to = activeFilterValues.map(value => value.max);
                }
                if (this.productFilters.diameter) {
                    const activeFilterValues = this.productFilters.diameter[0].values
                        .filter((enabled) => enabled.checked);
                    this.activeFilters.diameter = activeFilterValues.map(value => this.renderOptions(value));
                    this.activeFilters.diameter_from = activeFilterValues.map(value => value.min);
                    this.activeFilters.diameter_to = activeFilterValues.map(value => value.max);
                }
                if (this.productFilters.square) {
                    const activeFilterValues = this.productFilters.square[0].values
                        .filter((enabled) => enabled.checked);
                    this.activeFilters.square = activeFilterValues.map(value => this.renderOptions(value));
                    this.activeFilters.square_from = activeFilterValues.map(value => value.min);
                    this.activeFilters.square_to = activeFilterValues.map(value => value.max);
                }
                if (this.productFilters.depth) {
                    const activeFilterValues = this.productFilters.depth[0].values
                        .filter((enabled) => enabled.checked);
                    this.activeFilters.depth = activeFilterValues.map(value => this.renderOptions(value));
                    this.activeFilters.depth_from = activeFilterValues.map(value => value.min);
                    this.activeFilters.depth_to = activeFilterValues.map(value => value.max);
                }
            }
        }
    }

    onCheckChange(event, filter: string) {
        const option = event.source.value;
        if (this.isDimensionFilter(filter)) {
            this.addDimensionValuesToActiveFilter(event, filter);
        } else {
            if (event.source.checked) {
                this.activeFilters[filter].push(option);
            } else {
                const optionsArr = this.activeFilters[filter].filter(
                    (value: string) => value !== option
                );
                this.activeFilters[filter] = optionsArr;
            }
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

        this.buildAndSetFilters();
    }

    addDimensionValuesToActiveFilter(event, filter) {
        const values = event.source.value;
        const maxValueString = `${filter}_to`;
        const minValueString = `${filter}_from`;
        if (event.source.checked) {
            this.activeFilters[filter].push(this.renderOptions(values));
            this.activeFilters[maxValueString].push(values.max);
            this.activeFilters[minValueString].push(values.min);
        } else {
            const index = this.activeFilters[filter].indexOf(values);
            this.activeFilters[filter].splice(index, 1);
            this.activeFilters[maxValueString].splice(index, 1);
            this.activeFilters[minValueString].splice(index, 1);
        }
    }

    buildAndSetFilters() {
        let tempFilters = '';
        for (const [filter, options] of Object.entries(this.activeFilters)) {
            if ((filter === 'price_from' || filter === 'price_to') && this.isPriceChanged) {
                tempFilters += `${filter}:${options};`;
            } else {
                if (Array.isArray(options) && !this.dimensionFilters.includes(filter)) {
                    tempFilters += options.length ? `${filter}:${options};` : ``;
                }
            }
        }
        this.setFilters.emit(tempFilters);
        this.isClearAllVisible = tempFilters !== '';
        return tempFilters;
    }

    clearFilters() {
        this.activeFilters = {
            brand: [],
            price_from: 0,
            price_to: 0,
            type: [],
            category: [],
            shape: [],
            seating: [],
            color: [],
            height_from: [],
            height_to: [],
            width_from: [],
            width_to: [],
            length_from: [],
            length_to: [],
            diameter_from: [],
            diameter_to: [],
            square_from: [],
            square_to: [],
            depth_from: [],
            depth_to: [],
            depth: [],
            height: [],
            width: [],
            length: [],
            diameter: [],
            square: [],
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
        this.buildAndSetFilters();
    }

    onPriceChange() {
        this.activeFilters.price_from = this.minValue;
        this.activeFilters.price_to = this.maxValue;
        this.isPriceChanged = true;
        this.buildAndSetFilters();
    }

    closeFilters() {
        this.setMobileToggle.emit();
    }

    selectTab(filter) {
        this.activeTab = filter;
        if (filter !== 'price') {
            this.showClearBtn(
                this.productFilters[filter].filter(this.ifChecked),
                filter
            );
            if (this.productFilters[filter][0].values && isArray(this.productFilters[filter][0].values)) {
                const isEnabled = this.productFilters[filter][0].enabled;
                if (isEnabled) {
                    this.activeFilterTabData = [...this.productFilters[filter][0].values];
                }
            } else {
                this.activeFilterTabData = this.productFilters[filter].filter(
                    this.checkEnabled
                );
            }
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

    showClearBtn(data, filter) {
        this.clearOptionVisible[filter] = data.length > 0;
    }

    clearBtn(activeFilter) {
        if (activeFilter === 'price') {
            this.activeFilters.price_from = 0;
            this.activeFilters.price_to = 0;
            delete this.activeFilters.price_from;
            delete this.activeFilters.price_to;
            this.isPriceChanged = false;
        } else {
            this.activeFilters[activeFilter] = [];
            this.clearOptionVisible[activeFilter] = false;
        }
        this.buildAndSetFilters();
    }

    isDimensionFilter(filter: string): boolean {
        return this.dimensionFilters.includes(filter);
    }

    isArray(value): boolean {
        return Array.isArray(value);
    }

    emptyDimensions(dimensionFilter: string): boolean {
        if (this.isDimensionFilter(dimensionFilter)) {
            return this.productFilters[dimensionFilter][0].values.length <= 0;
        }
        return false;
    }
    isCollectionFilter(filter){
        return filter !== 'collection';

    }
    renderOptions(dimensionValue) {
        const {max, min} = dimensionValue;
        return `${min}" - ${max}"`;
    }
}
