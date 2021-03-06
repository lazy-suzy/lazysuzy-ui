import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Options} from 'ng5-slider';

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
    @Input() isBrandPage = false;
    @Input() isCollectionPage = false;
    objectKeys = Object.keys;
    isClearAllVisible = false;
    displayDimensionFilter = [];
    activeFilters = {
        brand: [],
        collection: [],
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
        country: [],
        designer: [],
        fabric: [],
        material: [],
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
        if (this.isCollectionPage) {
            this.activeTab = 'price';
        }
        this.selectTab(this.activeTab);
        this.activeRoute.queryParams.subscribe((params) => {
            this.isClearAllVisible = params.filters !== '';
        });
        this.populateDimensionFilters();
    }

    populateDimensionFilters() {
        this.displayDimensionFilter = [];
        for (const filter in this.productFilters) {
            if (this.isDimensionFilter(filter)) {
                this.displayDimensionFilter.push(this.productFilters[filter][0]);
            }
        }
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnChanges(change: any) {
        if (change.productFilters !== undefined) {
            this.productFilters = change.productFilters.currentValue;
            this.selectTab(this.activeTab);
            this.populateDimensionFilters();
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
                if (this.isCollectionPage) {
                    this.activeFilters.collection = this.productFilters.collection;
                } else {
                    delete this.activeFilters.collection;
                    delete this.productFilters.collection;
                }
                this.clearEmptyFilters();
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
        let collection = this.activeFilters.collection;
        let brand = this.activeFilters.brand;
        if (!this.isBrandPage) {
            brand = [];
        }
        if (!this.isCollectionPage) {
            collection = [];
        }
        this.activeFilters = {
            brand,
            collection,
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
            country: [],
            designer: [],
            fabric: [],
            material: [],
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

    /**
     * Check if filter is valid to be shown.
     * Important: The Order of checking here matters, don't change
     * @param filter- Filter to be checked
     */
    checkValidFilter(filter): boolean {
        if (filter === 'price') {
            return true;
        }
        if (this.isDimensionFilter(filter) || this.isCollectionFilter(filter)) {
            return false;
        }
        return this.productFilters[filter].length !== 0;
    }

    renderFilterName(filter): string {
        return filter.replace('_', ' ').toUpperCase();
    }

    selectTab(filter) {
        this.activeTab = filter;
        if (filter !== 'price' && filter !== 'size') {
            this.showClearBtn(
                this.productFilters[filter].filter(this.ifChecked),
                filter
            );
            if (filter === 'category') {
                this.activeFilterTabData = this.productFilters[filter].filter(value => value.enabled);
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
        if (filter !== 'price' && filter !== 'category') {
            return this.productFilters[filter].filter(this.checkEnabled).length === 0;
        } else {
            return false;
        }
    }

    checkEnabled(data) {
        return data.count > 0;
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

    isCollectionFilter(filter) {
        if (this.isCollectionPage && filter === 'brand') {
            return false;
        }
        return filter === 'collection';
    }

    renderOptions(dimensionValue) {
        const {max, min} = dimensionValue;
        return `${min}" - ${max}"`;
    }

    clearEmptyFilters() {
        for (const productFiltersKey in this.productFilters) {
            if (!this.dimensionFilters.includes(productFiltersKey) &&
                productFiltersKey !== 'price' &&
                productFiltersKey !== 'category'
            ) {
                this.productFilters[productFiltersKey] = this.productFilters[productFiltersKey].filter(value => value.count > 0);
            }
        }
    }
}
