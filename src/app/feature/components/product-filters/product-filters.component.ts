import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
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
    @Input() isBrandPage: boolean = false;
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
    dimensionsKey = 'dimensions';
    objectKeys = Object.keys;
    isClearAllVisible = false;
    activeFilters = {
        brand: [],
        price_from: 0,
        price_to: 0,
        type: [],
        height_from: 0,
        height_to: 0,
        width_from: 0,
        width_to: 0,
        length_from: 0,
        length_to: 0,
        diameter_from: 0,
        diameter_to: 0,
        square_from: 0,
        square_to: 0,
        height: '',
        width: '',
        length: '',
        diameter: '',
        square: '',
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
            change.isChangingBrandList.currentValue == true
        ) {
            console.log('this is ischanging brand list: ', this.isChangingBrandList);
            this.isPriceChanged = false;
            this.activeFilters = {
                brand: this.activeFilters.brand,
                price_from: 0,
                price_to: 0,
                type: [],
                height_from: 0,
                height_to: 0,
                width_from: 0,
                width_to: 0,
                length_from: 0,
                length_to: 0,
                diameter_from: 0,
                diameter_to: 0,
                square_from: 0,
                square_to: 0,
                height: '',
                width: '',
                length: '',
                diameter: '',
                square: '',
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
                    if(this.productFilters.height)
                    {

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
        if (event.source.checked) {
            const values = event.source.value;
            this.activeFilters[filter] = this.renderOptions(values);
            const maxValueString = `${filter}_to`;
            const minValueString = `${filter}_from`;
            this.activeFilters[maxValueString] = values.max;
            this.activeFilters[minValueString] = values.min;
        }
        this.buildAndSetFilters();
    }

    clearFilters() {
        if (this.isBrandPage) {
            this.activeFilters = {
                brand: this.activeFilters.brand,
                price_from: 0,
                price_to: 0,
                type: [],
                height_from: 0,
                height_to: 0,
                width_from: 0,
                width_to: 0,
                length_from: 0,
                length_to: 0,
                diameter_from: 0,
                diameter_to: 0,
                square_from: 0,
                square_to: 0,
                height: '',
                width: '',
                length: '',
                diameter: '',
                square: '',
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
                height_from: 0,
                height_to: 0,
                width_from: 0,
                width_to: 0,
                length_from: 0,
                length_to: 0,
                diameter_from: 0,
                diameter_to: 0,
                square_from: 0,
                square_to: 0,
                height: '',
                width: '',
                length: '',
                diameter: '',
                square: '',
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
            if (filter.search('_from') !== -1 || filter.search('_to') !== -1) {
                if (options > 0) {
                    tempFilters += `${filter}:${options};`;
                }
            } else {
                if (Array.isArray(options)) {
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
        if (filter !== 'price' && filter !== 'dimensions') {
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
        const optionString = `${maxValue} - ${minValue}`;
        return optionString;
    }
}
