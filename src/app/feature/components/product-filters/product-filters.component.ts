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
    @Input() isCollectionPage = false;
    @Input() productFilters: IFilterData = {
        brand: [],
        price: {
            from: 0,
            to: 0,
            max: 0,
            min: 0,
        },
        type: [],
        color: [],
        shape: [],
        seating: [],
        country: [],
        designer: [],
        fabric: [],
        material: [],
        height: [],
        width: [],
        length: [],
        diameter: [],
        depth: [],
        square: [],
        category: [],
        collection: [],
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
        'depth'
    ];
    activeFilters = {
        brand: [],
        collection: [],
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
        depth_from: [],
        depth_to: [],
        depth: [],
        height: [],
        width: [],
        length: [],
        diameter: [],
        square: [],
        color: [],
        category: [],
        shape: [],
        seating: [],
        country: [],
        designer: [],
        fabric: [],
        material: [],
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
    // Dimension Filters Display
    displayDimensionFilter: any = [];

    constructor(private activeRoute: ActivatedRoute) {
    }

    ngOnInit() {

        this.activeRoute.queryParams.subscribe((params) => {
            this.setClearButtonVisibility(params.filters);
        });
        // Get Dimension filters in another variable. To show them separately.
        this.populateDimensionFilters();
    }

    populateDimensionFilters() {
        this.displayDimensionFilter = [];
        for (const filter in this.productFilters) {
            if (this.dimensionFilterKeysToExclude.includes(filter)) {
                this.displayDimensionFilter.push(this.productFilters[filter][0]);
            }
        }
    }

    private setClearButtonVisibility(filters) {
        if (this.isBrandPage || this.isCollectionPage) {
            const filtersArray = filters.split(';').filter(value => value);
            if (filtersArray.length <= 1) {
                this.isClearAllVisible = false;
            } else {
                this.isClearAllVisible = true;
            }
        } else {
            this.isClearAllVisible = !!filters;
        }
    }

// tslint:disable-next-line: use-lifecycle-interface
    ngOnChanges(change: any) {
        if (
            change.isChangingBrandList &&
            change.isChangingBrandList.currentValue === true
        ) {
            this.isPriceChanged = false;
            this.activeFilters = {
                brand: this.activeFilters.brand,
                collection: [],
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
                depth_from: [],
                depth_to: [],
                depth: [],
                height: [],
                width: [],
                length: [],
                diameter: [],
                square: [],
                color: [],
                category: [],
                shape: [],
                seating: [],
                country: [],
                designer: [],
                fabric: [],
                material: [],
            };
        } else {
            if (
                change.productFilters &&
                change.productFilters.currentValue !== undefined
            ) {
                this.productFilters = change.productFilters.currentValue;
                if (this.isCollectionPage) {
                    this.activeFilters.collection = this.productFilters.collection;
                } else {
                    delete this.productFilters.collection;
                }
                this.clearEmptyFilters();
                this.populateDimensionFilters();
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
                    if (this.productFilters.country) {
                        this.activeFilters.country = this.productFilters.country
                            .filter((mfgCountry) => mfgCountry.checked)
                            .map((mfgCountry) => mfgCountry.value);
                    }
                    if (this.productFilters.designer) {
                        this.activeFilters.designer = this.productFilters.designer
                            .filter((designer) => designer.checked)
                            .map((designer) => designer.value);
                    }
                    if (this.productFilters.fabric) {
                        this.activeFilters.fabric = this.productFilters.fabric
                            .filter((fabric) => fabric.checked)
                            .map((fabric) => fabric.value);
                    }
                    if (this.productFilters.material) {
                        this.activeFilters.material = this.productFilters.material
                            .filter((material) => material.checked)
                            .map((material) => material.value);
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
                if (
                    Math.round(this.productFilters.price.from) === Math.round(this.productFilters.price.min) &&
                    Math.round(this.productFilters.price.to) === Math.round(this.productFilters.price.max)
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
        // this.buildAndSetFilters();
    }

    clearFilters() {
        if (this.isBrandPage) {
            this.activeFilters = {
                brand: this.activeFilters.brand,
                collection: [],
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
                depth_from: [],
                depth_to: [],
                depth: [],
                height: [],
                width: [],
                length: [],
                diameter: [],
                square: [],
                color: [],
                category: [],
                shape: [],
                seating: [],
                country: [],
                designer: [],
                fabric: [],
                material: [],
            };
        } else if (this.isCollectionPage) {
            this.activeFilters = {
                brand: [],
                collection: this.activeFilters.collection,
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
                depth_from: [],
                depth_to: [],
                depth: [],
                height: [],
                width: [],
                length: [],
                diameter: [],
                square: [],
                color: [],
                category: [],
                shape: [],
                seating: [],
                country: [],
                designer: [],
                fabric: [],
                material: [],
            };
        } else {
            this.activeFilters = {
                brand: [],
                collection: [],
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
                depth_from: [],
                depth_to: [],
                depth: [],
                height: [],
                width: [],
                length: [],
                diameter: [],
                square: [],
                color: [],
                category: [],
                shape: [],
                seating: [],
                country: [],
                designer: [],
                fabric: [],
                material: [],
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
            if ((filter === 'price_from' || filter === 'price_to') && this.isPriceChanged) {
                tempFilters += `${filter}:${options};`;
            } else {
                if (Array.isArray(options) && !this.dimensionFilterKeysToExclude.includes(filter)) {
                    tempFilters += options.length ? `${filter}:${options};` : ``;
                }
            }
        }
        this.setFilters.emit(tempFilters);
        this.setClearButtonVisibility(tempFilters);
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
                this.productFilters[filter].length === 0
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

    //!((filter === 'brand' || filter === 'category') && (isBrandPage === true))
    checkIfValidFilter(filter): boolean {
        if (!this.dimensionFilterKeysToExclude.includes(filter) && filter !== 'price') {
            if (this.productFilters[filter].length === 0) {
                return false;
            }
        }

        if (filter === 'brand') {
            if (this.isCollectionPage || this.isBrandPage) {
                return false;
            }
        }
        return true;
    }

    renderFilterName(filter): string {
        return filter.replace('_', ' ').toUpperCase();
    }

    clearEmptyFilters() {
        for (const productFiltersKey in this.productFilters) {
            if (!this.dimensionFilterKeysToExclude.includes(productFiltersKey) &&
                productFiltersKey !== 'price' &&
                productFiltersKey !== 'category') {
                this.productFilters[productFiltersKey] = this.productFilters[productFiltersKey].filter(value => value.count > 0);
            }
        }
    }
}
