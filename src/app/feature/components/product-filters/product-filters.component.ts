import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Options} from 'ng5-slider';
import {IFilterData} from 'src/app/shared/models';

@Component({
    selector: 'app-product-filters',
    templateUrl: './product-filters.component.html',
    styleUrls: ['./product-filters.component.less'],
})
export class ProductFiltersComponent implements OnInit {
    @Output() setFilters = new EventEmitter<any>();
    @Input() isBrandPage = false;
    @Input() productFilters: IFilterData = {
        brand: [],
        type: [],
        color: [],
        category: [],
        shape: [],
        seating: [],
        height: [],
        width: [],
        length: [],
        diameter: [],
        square: [],
        price: {from: 0, min: 0, max: 0, to: 0},
    };
    @Input() isChangingBrandList = false;
    objectKeys = Object.keys;
    isClearAllVisible = false;
    dimensionFilterKeysToExclude = [
        'height',
        'width',
        'length',
        'diameter',
        'square',
    ];
    activeFilters = {
        brand: [],
        price_from: 0,
        price_to: 0,
        type: [],
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
        height: [],
        width: [],
        length: [],
        diameter: [],
        square: [],
        color: [],
        category: [],
        shape: [],
        seating: [],
    };
    isPriceChanged = false;
    minValue = 100;
    maxValue = 600;
    sliderOptions: Options = {
        floor: 10,
        ceil: 500,
        translate: (value: number) => {
            return '$' + value;
        },
    };

    constructor(private activeRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activeRoute.queryParams.subscribe((params) => {
            this.isClearAllVisible = params.filters !== '';
        });
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnChanges(change: any) {
        if (
            change.isChangingBrandList &&
            change.isChangingBrandList.currentValue === true
        ) {
            console.log('this is ischanging brand list: ', this.isChangingBrandList);
            this.isPriceChanged = false;
            this.activeFilters = {
                brand: this.activeFilters.brand,
                price_from: 0,
                price_to: 0,
                type: [],
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
                height: [],
                width: [],
                length: [],
                diameter: [],
                square: [],
                color: [],
                category: [],
                shape: [],
                seating: [],
            };
        } else {
            if (
                change.productFilters &&
                change.productFilters.currentValue !== undefined
            ) {
                this.productFilters = change.productFilters.currentValue;
                if (this.productFilters && !this.isPriceChanged) {
                    this.minValue = this.productFilters.price.from;
                    this.maxValue = this.productFilters.price.to;
                    this.sliderOptions = {
                        floor: this.productFilters.price.min,
                        ceil: this.productFilters.price.max,
                        translate: (value: number) => {
                            return '$' + value;
                        },
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
                }
                if (
                    this.productFilters.price.from === this.productFilters.price.min &&
                    this.productFilters.price.to === this.productFilters.price.max
                ) {
                    this.isPriceChanged = false;
                } else {
                    this.isPriceChanged = true;
                }
            }
        }
    }

    onCheckChange(event, filter: string) {
        const option = event.source.value;
        if (this.productFilters[filter][0].values) {
            this.setDimensionFilters(event, filter);
        } else {
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
            this.buildAndSetFilters();
        }

    }

    setDimensionFilters(event, filter) {
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
        //this.buildAndSetFilters();
    }

    clearFilters() {
        if (this.isBrandPage) {
            this.activeFilters = {
                brand: this.activeFilters.brand,
                price_from: 0,
                price_to: 0,
                type: [],
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
                height: [],
                width: [],
                length: [],
                diameter: [],
                square: [],
                color: [],
                category: [],
                shape: [],
                seating: [],
            };
        } else {
            this.activeFilters = {
                brand: [],
                price_from: 0,
                price_to: 0,
                type: [],
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
                height: [],
                width: [],
                length: [],
                diameter: [],
                square: [],
                color: [],
                category: [],
                shape: [],
                seating: [],
            };
        }

        delete this.activeFilters.price_from;
        delete this.activeFilters.price_to;
        this.isPriceChanged = false;
        this.buildAndSetFilters();
    }

    buildAndSetFilters() {
        let tempFilters = '';
        for (const [filter, options] of Object.entries(this.activeFilters)) {
            if (filter === 'price_from' || filter === 'price_to') {
                tempFilters += `${filter}:${options};`;
            } else {
                if (Array.isArray(options) && !this.dimensionFilterKeysToExclude.includes(filter)) {
                    tempFilters += options.length ? `${filter}:${options};` : ``;
                }
            }
        }
        this.setFilters.emit(tempFilters);
        this.isClearAllVisible = tempFilters !== '';
        return tempFilters;
    }

    onPriceChange() {
        this.activeFilters.price_from = this.minValue;
        this.activeFilters.price_to = this.maxValue;
        this.isPriceChanged = true;
        this.buildAndSetFilters();
    }

    disableTab(filter) {
        if (filter !== 'price') {
            return (
                this.productFilters[filter].filter((data) => data.enabled).length === 0
            );
        } else {
            return false;
        }
    }

    isArray(value) {
        return Array.isArray(value);
    }

    renderOptions(option) {
        const maxValue = option.max;
        const minValue = option.min;
        return `${minValue}" - ${maxValue}"`;
    }
}
