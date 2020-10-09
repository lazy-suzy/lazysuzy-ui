import {Component, OnInit, Output, EventEmitter, Input, HostListener} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Options} from 'ng5-slider';
import {IFilterData} from '../../../shared/models';

@Component({
    selector: 'app-browse-filter',
    templateUrl: './browse-filter.component.html',
    styleUrls: ['./browse-filter.component.less', '../board.component.less']
})
export class BrowsefilterComponent implements OnInit {
    showLoader = false;
    filterForm: any;

    @Output() updatesFromFilter: EventEmitter<any> = new EventEmitter();
    @Output() addProduct: EventEmitter<any> = new EventEmitter();
    @Input() filterData: IFilterData;
    objectKeys = Object.keys;
    isClearAllVisible = false;
    dimensionFilters = [
        'height',
        'width',
        'length',
        'diameter',
        'square',
        'depth'
    ];
    activeFilters = {
        brand: [],
        price_from: 0,
        price_to: 0,
        type: [],
        color: [],
        shape: [],
        seating: [],
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
        height: [],
        width: [],
        length: [],
        diameter: [],
        square: [],
        depth: [],
    };
    selectedFilter = '';
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

    constructor(private fb: FormBuilder) {

    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnChanges(change: any) {
        // if (
        //   changes['filterData'] &&
        //   changes['filterData'].previousValue !== changes['filterData'].currentValue
        // ) {
        //   let filterData = changes['filterData'].currentValue || [];
        //   this.filterData = { ...filterData } || {};
        //   this.createForm(this.filterData);
        // }
        if (
            change.filterData.currentValue !== undefined &&
            Object.keys(change.filterData.currentValue).length > 0
        ) {
            this.filterData = change.filterData.currentValue;
            delete this.filterData.category;
            if (
                this.filterData &&
                !this.isPriceChanged &&
                this.filterData.price.to !== 0
            ) {
                this.minValue = this.filterData.price.from;
                this.maxValue = this.filterData.price.to;
                this.silderOptions = {
                    floor: this.filterData.price.min,
                    ceil: this.filterData.price.max,
                    translate: (value: number): string => {
                        return '$' + value;
                    }
                };
                this.activeFilters.price_from = this.minValue;
                this.activeFilters.price_to = this.maxValue;
            }

            if (this.isPriceChanged) {
                this.toggleFilterOption('price');
            }
        }
    }

    ngOnInit(): void {
        console.log('thsi si filter value: ', this.filterData);
    }

    toggleFilterOption(filter: string) {
        if (this.selectedFilter === filter) {
            this.selectedFilter = '';
            return;
        }
        this.selectedFilter = filter;
    }

    onCheckChange(event, filter: string) {
        const option: string = event.source.value;
        if (this.filterData[filter][0].values) {
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
            Math.round(this.minValue) === this.filterData.price.from &&
            Math.round(this.maxValue) === this.filterData.price.to
        ) {
            delete this.activeFilters.price_from;
            delete this.activeFilters.price_to;
            this.isPriceChanged = false;
        } else {
            this.isPriceChanged = true;
        }
        const self = this;
        setTimeout(() => {
            self.selectedFilter = '';
        }, 3000);
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
        this.activeFilters = {
            brand: [],
            price_from: 0,
            price_to: 0,
            type: [],
            color: [],
            shape: [],
            seating: [],
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
            height: [],
            width: [],
            length: [],
            diameter: [],
            square: [],
            depth: [],
        };
        delete this.activeFilters.price_from;
        delete this.activeFilters.price_to;
        this.isPriceChanged = false;
        this.selectedFilter = '';
        this.buildAndSetFilters();
    }

    buildAndSetFilters(): string {
        let tempFilters = '';
        for (const [filter, options] of Object.entries(this.activeFilters)) {
            if (filter === 'price_from' || filter === 'price_to') {
                tempFilters += `${filter}:${options};`;
            } else {
                if (Array.isArray(options) && !this.dimensionFilters.includes(filter)) {
                    tempFilters += options.length ? `${filter}:${options};` : ``;
                }
            }
        }
        this.updatesFromFilter.emit({
            name: 'APPLY_FILTERS',
            payload: tempFilters
        });
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
                this.filterData[filter].filter((data) => data.enabled).length === 0
            );
        } else {
            return false;
        }
    }

    convertFilterDataForPlugin(brand, color) {
        const brands = (brand || []).map((ele) => {
            return {
                ...ele,
                label: ele.name
            };
        });
        const colors = (color || []).map((ele) => {
            return {
                ...ele,
                label: ele.name
            };
        });
        return {
            brands,
            colors
        };
    }

    formatLabel(value: number | null) {
        if (!value) {
            return 0;
        }
        return value;
    }

    renderOptions(option) {
        const maxValue = option.max;
        const minValue = option.min;
        return `${minValue}" - ${maxValue}"`;
    }

    onScrollFilterEvent($event) {
        const delta = Math.max(-1, Math.min(1, ($event.wheelDelta || -$event.detail)));
        let ratio = 40;
        if (Math.abs($event.deltaY) < 100) {
            ratio = 7;
        }
        console.log($event, ratio);
        document.getElementById('scrollableDiv').scrollLeft -= (delta * ratio); // Multiplied by 40
        $event.preventDefault();
    }
}
