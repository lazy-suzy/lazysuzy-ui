import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialogUtilsService} from 'src/app/shared/services';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState,} from '@angular/cdk/layout';
import {isArray} from 'util';

@Component({
    selector: 'app-variations',
    templateUrl: './variations.component.html',
    styleUrls: ['./variations.component.less'],
})
export class VariationsComponent implements OnInit {
    @Output() setImage = new EventEmitter<any>();
    @Output() setPrice = new EventEmitter<any>();
    @Output() reload = new EventEmitter<any>();
    @Output() setSelectionChecked = new EventEmitter<any>();
    @Output() clearSelection = new EventEmitter<any>();
    @Output() setSelection = new EventEmitter<any>();

    @Input() variations = [];
    @Input() inputSelections = {};
    @Input() isSwatchExist = false;
    @Input() hasSelection = true;

    beforeSelection = false;
    selectedFlag = false;
    bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
        Breakpoints.Handset
    );
    swatches = []; // This stores all available swatches

    /**
     * Stores Variations that are filtered by selections.
     * Initally equal to @var variations
     */
    filteredVariations = [];

    swatchFilter = [];
    /**
     * Stores all the selections made by the user in key:value format
     * key is the @string type of filter and value is @array for multi-select and @string for single-select filters
     */
    selections = {};

    selectedIndex: number;

    priceData = {
        price: '',
        wasPrice: '',
    };

    selectionsExist: boolean;
    bpSubscription: Subscription;
    isHandset: boolean;

    selectionOptions = {}; // stores all options available for selections

    // Stores currently selected swatch
    selectedSwatch = {
        image: '',
        swatch_image: null,
        price: '',
        wasPrice: '',
    };

    previousSwatch;
    selectionAdd = 1;
    selectionRemove = 2;

    constructor(
        private router: Router,
        private matDialogUtils: MatDialogUtilsService,
        private breakpointObserver: BreakpointObserver
    ) {
    }

    ngOnInit() {
        this.bpSubscription = this.bpObserver.subscribe(
            (handset: BreakpointState) => {
                this.isHandset = handset.matches;
            }
        );
        this.selectionsExist =
            this.inputSelections && Object.keys(this.inputSelections)[0] !== 'type';
        if (this.selectionsExist) {
            // tslint:disable-next-line: forin
            for (const key in this.inputSelections) {
                const value = this.inputSelections[key];
                // tslint:disable-next-line: forin
                for (const object in value) {
                    const newObject = JSON.stringify(value[object]);
                    const options = JSON.parse(newObject);
                    if (Array.isArray(options)) {
                        // tslint:disable-next-line: prefer-for-of
                        for (let i = 0; i < options.length; i++) {
                            this.selectionOptions[options[i]] = true;
                        }
                    }
                }
            }
        }
        const self = this;
        this.filteredVariations = this.variations;

        this.swatches = this.variations
            .filter((variation) => {
                return variation.swatch_image !== null;
            })
            .filter((variation) => {
                return self.filterDuplicateSwatches(variation, self);
            });
        let countSingleSelect = 0;
        if (this.inputSelections['type'] === 'redirect') {
            this.setSelectionChecked.emit(true);
        } else {
            for (const item in this.inputSelections) {
                this.inputSelections[item].selected = false;
                if (this.inputSelections[item].select_type === 'single_select') {
                    countSingleSelect++;
                }
            }
            if (countSingleSelect === 0) {
                this.setSelectionChecked.emit(true);
            }
        }
    }

    onDestroy(): void {
        this.bpSubscription.unsubscribe();
    }

    /**
     * Sets the current selected variation to the variation passed in param
     * @param variation The variation to be selected
     * @param index Index of the selected variation
     */
    selectedVariation(variation, index: number) {
        console.log('variation com: ', variation);
        if (variation.has_parent_sku) {
            if (this.isHandset) {
                this.router.navigate([`/product/${variation.variation_sku}`]);
                this.reload.emit();
            } else {
                this.matDialogUtils.openVariationDialog(variation.variation_sku);
            }
        } else {
            this.selectedSwatch = {
                image: variation.image,
                swatch_image: variation.swatch_image,
                price: variation.price,
                wasPrice: variation.was_price,
            };
            this.selectedIndex = index;
            // this.priceData = {
            //     price: variation.price,
            //     wasPrice: variation.was_price,
            // };
            // this.setPrice.emit(this.priceData);
            this.setImage.emit(variation);
            this.filterSwatches();
            // this.updateSwatches();
        }
        this.setSelectedOptionsOfVariation(variation);
        this.selectionEmit();
    }

    selectionEmit() {
        this.beforeSelection = true;
        this.selectedFlag = false;
        for (const selected in this.inputSelections) {
            if (this.inputSelections[selected].select_type === 'single_select') {
                this.beforeSelection =
                    this.beforeSelection && this.inputSelections[selected].selected;
                this.selectedFlag =
                    this.selectedFlag || this.inputSelections[selected].selected;
            }
        }
        console.log('beforeSelection: ', this.beforeSelection);

        this.setSelectionChecked.emit(this.beforeSelection);
    }

    /**
     * Add or remove a single select option from selections object
     * Then update swatches based on final result
     * @return void
     * @param option
     * @param type
     */
    selectedOption(option: string, type: string) {
        console.log('this.selections: ', this.selections);
        console.log('option: ', option);
        console.log('type: ', type);

        if (this.selections[type] === option) {
            delete this.selections[type];
            this.inputSelections[type].selected = false;
        } else {
            this.selections[type] = option;
            this.inputSelections[type].selected = true;
        }
        this.selectionEmit();

        console.log('inputSelections: ', this.inputSelections);
        console.log(
            'selectedSwatch.swatch_image: ',
            this.selectedSwatch.swatch_image
        );
        console.log(
            'selectedSwatch.swatch_image: ',
            Boolean(this.selectedSwatch.swatch_image)
        );
        this.updateSwatches();
        this.updatePriceBasedOnSelections();
        this.filterVariationsForSingleSelect();
    }

    /**
     * Set all options available for a particular swatch.
     * Only single-select filters are updated
     * @param variation The variation's swatch image to be used to set the options
     */
    setSelectedOptionsOfVariation(variation: any) {
        // Get all the options belonging to swatch
        const variations = this.variations
            .filter((v) => v.name === variation.name)
            .reduce((acc, {features}) => {
                Object.keys(features).forEach((key) => {
                    if (acc[key]) {
                        if (!acc[key].includes(features[key])) {
                            acc[key].push(features[key]);
                        }
                    } else {
                        acc[key] = [features[key]];
                    }
                });
                return acc;
            }, {});
        const variationProducts = this.variations.filter(v => v.name === variation.name).filter(v => this.checkSwatchSelection(v, this));
        if (variationProducts.length === 0) {
            this.clearSingleSelections();
        }

        // Filter @var selectionOptions based on all options
        // tslint:disable-next-line:forin
        for (const filter in variations) {
            const filterValue = variations[filter];

            if (this.inputSelections[filter].select_type === 'single_select') {
                const options = this.inputSelections[filter].options;
                for (const value of options) {
                    if (!filterValue.includes(value)) {
                        this.selectionOptions[value] = false;
                    }
                }
                if (filterValue.length === 1) {
                    this.selections[filter] = filterValue[0];
                    this.inputSelections[filter].selected = true;
                }
            }
        }
        this.updatePriceBasedOnSelections();

    }

    private updatePriceBasedOnSelections() {
        if (!this.selectedSwatch.swatch_image) {
            return;
        }
        const filteredVariations = this.variations.filter(v => v.swatch_image === this.selectedSwatch.swatch_image);
        const self = this;
        let minPrice = 0;
        let maxPrice = 0;
        let wasMaxPrice = 0;
        let wasMinPrice = 0;
        filteredVariations.forEach(value => {
            const isValid = this.checkSwatchSelection(value, self);
            if (isValid) {
                if (minPrice && maxPrice) {
                    if (Number(maxPrice) < Number(value.price)) {
                        maxPrice = value.price;
                        wasMaxPrice = value.was_price;
                    }
                    if (Number(minPrice) > Number(value.price)) {
                        minPrice = value.price;
                        wasMinPrice = value.was_price;
                    }

                } else {
                    minPrice = value.price;
                    maxPrice = value.price;
                    wasMaxPrice = value.was_price;
                    wasMinPrice = value.was_price;
                }
            }
        });
        if (maxPrice === minPrice) {
            this.priceData = {
                price: `${minPrice}`,
                wasPrice: `${wasMinPrice}`,
            };
        } else {
            this.priceData = {
                price: `${minPrice} - ${maxPrice}`,
                wasPrice: `${wasMinPrice} -  ${wasMinPrice}`,
            };
        }

        this.setPrice.emit(this.priceData);
    }

    /**
     * Whenever multi-select options are changed this method is called.
     * It either adds the option or removes the option if already present
     * Then updates the swatches based on final result.
     * @param event Event type (checked || unchecked)
     * @param option Option Value in @var this.selectionOptions
     * @param type Type of multi-select Filter
     */
    onCheckChange(event, option: string, type: string) {
        if (event.source.checked) {
            this.addCheckedToMultiSelect(type, option);
            this.selectedFlag = true;
        } else {
            this.removeCheckedFromMultiSelect(type, option);
        }
        this.resetSelectedSwatch();
        this.updateOptions(type, event.source.checked);
        // this.updateSwatches();
    }

    private removeCheckedFromMultiSelect(type: string, option: string) {
        this.selections[type] = this.selections[type].filter(
            (value: string) => value !== option
        );
        if (this.selections[type].length < 1) {
            delete this.selections[type];
            this.enableSelectionsOtherThanType(type);
        }
        const selectionLength = Object.keys(this.selections).length;
        if (selectionLength === 0) {
            this.clearVariations();
        }
    }

    private resetSelectedSwatch() {
        this.selectedSwatch = {
            image: '',
            swatch_image: null,
            price: '',
            wasPrice: '',
        };
    }

    private addCheckedToMultiSelect(type: string, option: string) {
        if (this.selections[type]) {
            this.selections[type].push(option);
        } else {
            this.selections[type] = [option];
        }
    }

    enableSelectionsOtherThanType(type) {
        for (const key in this.inputSelections) {
            if (key !== type && this.inputSelections[key].select_type === 'multi_select') {
                const options = this.inputSelections[key].options;
                for (const option of options) {
                    this.selectionOptions[option] = true;
                }
            }
        }

    }

    /**
     * Update variations based on values in current selections
     * Valid variations are marked as enabled(true) in @method checkSwatchSelection
     * return filtered variations ie all the variations that were enabled.
     * @returns array filteredVariations
     */
    updateVariationsBasedOnSelections() {
        const self = this;
        this.swatchFilter = [];
        const filteredVariations = this.variations
            .map((variation) => {
                return {
                    ...variation,
                    enabled: this.checkSwatchSelection(variation, self),
                };
            })
            .filter((variation) => {
                if (variation.swatch_image !== null) {
                    return this.filterDuplicateSwatches(variation, self);
                }
            });
        this.swatches = [];
        for (const variation of filteredVariations) {
            if (
                this.swatchFilter.includes(variation.swatch_image) &&
                this.previousSwatch.swatch_image === variation.swatch_image
            ) {
                this.swatches.pop();
            }
            this.swatches.push(variation);
            this.previousSwatch = variation;
        }
        return filteredVariations;
    }

    clearSingleSelections() {
        const keys = Object.keys(this.inputSelections).filter(key => this.inputSelections[key].select_type === 'single_select');
        for (const key of keys) {
            this.selections.hasOwnProperty(key);
            {
                delete this.selections[key];
            }
        }
    }

    /**
     * Clears all options in @this.selections and resets all filters.
     */
    clearVariations() {
        this.clearSelection.emit(true);
        this.selections = {};
        this.selectedIndex = null;
        this.setPrice.emit('');
        this.setImage.emit('');
        this.setSelectionChecked.emit(false);
        for (const item in this.inputSelections) {
            this.inputSelections[item].selected = false;
        }
        this.selectionEmit();
        this.selectedSwatch = {
            image: '',
            swatch_image: null,
            price: '',
            wasPrice: '',
        };
        this.selectedFlag = false;
        // this.beforeSelection = true;
        this.setSelection.emit(true);
        this.filterSwatches();
        this.updateSwatches();
        console.log('hasSelection: ', this.hasSelection);
    }

    /**
     * Marks variation as enabled if any one of the feature is present in the selection.
     * @param variation The variation to be marked
     * @param self  The context, If empty takes 'this' as current context
     */
    selectSwatchContainingSelection(variation, self = this): boolean {
        let isValidVariation = true;
        for (const key in self.selections) {
            if (
                variation.features[key] === self.selections[key] ||
                self.selections[key].includes(variation.features[key])
            ) {
                isValidVariation = true;
                break;
            } else {
                isValidVariation = false;
            }
        }
        return isValidVariation;
    }

    /**
     *
     * @param type
     * @param isChecked
     */
    updateOptions(type: string, isChecked) {
        const self = this;
        self.swatchFilter = [];
        const filteredSwatches = ([] = this.variations
            .map((variation) => {
                return {
                    ...variation,
                    enabled: self.checkSwatchSelection(variation, self),
                };
            })
            .filter((variation) => {
                if (variation.swatch_image !== null) {
                    return self.filterDuplicateSwatches(variation, self);
                }
            }));

        this.swatches = [];
        for (const variation of filteredSwatches) {
            if (
                this.swatchFilter.includes(variation.swatch_image) &&
                this.previousSwatch.swatch_image === variation.swatch_image
            ) {
                this.swatches.pop();
            }
            this.swatches.push(variation);
            this.previousSwatch = variation;
        }

        if (isChecked) {
            const excludedOptions = this.inputSelections[type].options;
            for (const key in this.selectionOptions) {
                if (excludedOptions.indexOf(key) === -1) {
                    this.selectionOptions[key] = false;
                }
            }
        }
        const filteredVariations = this.variations.filter((v) => {
            const features = v.features;
            let isValidVariation: boolean;
            for (const key in this.selections) {
                if (
                    v.features[key] === this.selections[key] ||
                    this.selections[key].includes(v.features[key])
                ) {
                    isValidVariation = true;
                    break;
                } else {
                    isValidVariation = false;
                }
            }
            return isValidVariation;
        });
        filteredVariations.forEach((variation) => {
            const features = variation.features;
            for (const filter in features) {
                if (filter !== type && filter !== 'color') {
                    const filterValue = features[filter];
                    const options = this.inputSelections[filter].options;
                    for (const option of options) {
                        if (filterValue === option) {
                            this.selectionOptions[option] = true;
                        }
                    }
                }
            }
        });
    }

    /**
     * This method updates which swatches to show based on selections.
     * If swatch is selected
     * @emits setPrice // Set price Event
     * @emits setImage // setImage Event
     */
    updateSwatches() {
        const self = this;
        self.swatchFilter = [];
        const filteredSwatches = ([] = this.variations
            .map((variation) => {
                return {
                    ...variation,
                    enabled: self.checkSwatchSelection(variation, self),
                };
            })
            .filter((variation) => {
                if (variation.swatch_image !== null) {
                    return self.filterDuplicateSwatches(variation, self);
                }
            }));
        // const filteredSwatches = this.variations.map(variation => {
        //     return {
        //         ...variation,
        //         enabled: self.checkSwatchSelection(variation, self)
        //     };
        // }).filter(variation => {
        //    return variation.name === 'Dusty Teal, Twill' || variation.swatch_image;
        //     // if (variation.swatch_image !== null) {
        //     //     return self.filterDuplicateSwatches(variation, self);
        //     // }
        // });
        console.log(filteredSwatches);
        this.swatches = [];
        for (const variation of filteredSwatches) {
            if (
                this.swatchFilter.includes(variation.swatch_image) &&
                this.previousSwatch.swatch_image === variation.swatch_image
            ) {
                this.swatches.pop();
            }
            this.swatches.push(variation);
            this.previousSwatch = variation;
        }
        this.filteredVariations = this.variations.filter((variation) => {
            if (self.selectedSwatch.swatch_image) {
                return (
                    self.checkSwatchSelection(variation, self) &&
                    variation.swatch_image === self.selectedSwatch.swatch_image
                );
            }
            return self.checkSwatchSelection(variation, self);
        });

        if (
            this.filteredVariations.length === 1 ||
            this.selectedSwatch.swatch_image
        ) {
            this.priceData = {
                price: this.filteredVariations[0].price,
                wasPrice: this.filteredVariations[0].was_price,
            };
            this.setPrice.emit(this.priceData);
            this.setImage.emit(this.filteredVariations[0]);
        } else {
            this.checkSwatchActive();
        }
    }

    filterVariationsForSingleSelect() {
        if (this.filteredVariations.length > 0) {
            this.filterSwatchesBasedOnValidVariations();
        }
    }

    filterSwatchesBasedOnValidVariations() {
        let excludedOptions = [];
        // tslint:disable-next-line:forin
        for (const selection in this.selections) {
            const options = this.inputSelections[selection].options;
            excludedOptions = [...excludedOptions, ...options];
        }

        for (const option in this.selectionOptions) {
            if (!excludedOptions.includes(option)) {
                this.selectionOptions[option] = false;
            }
        }
        for (const value of this.filteredVariations) {
            // console.log('value ', value);

            const options = value.features;
            // console.log('options ', options);

            // tslint:disable-next-line: forin
            for (const features in options) {
                const feature = options[features];
                // console.log('feature: ', feature);
                // console.log('value.swatch_image ', value);
                // console.log('this.selectedSwatch ', this.selectedSwatch);

                if (feature && feature.charAt(0) !== '#') {
                    // console.log('filter feature: ', feature);
                    if (this.selectionOptions.hasOwnProperty(feature)) {
                        this.selectionOptions[feature] = true;
                    }
                }

                // console.log('this.selectionOptions[feature]: ', this.selectionOptions);
            }
        }
    }

// https://www.lazysuzy.com/westelm/westelm_images/202040_0378_img24l.jpg
    checkSwatchSelection(variation, self) {
        let isValidVariation = true;
        for (const key in self.selections) {
            if (this.selectionHasFeature(variation.features, key)) {
                isValidVariation = true;
            } else {
                isValidVariation = false;
                break;
            }
        }
        return isValidVariation;
    }

    selectionHasFeature(feature, key) {
        if (!isArray(this.selections[key]) && feature[key] === this.selections[key]) {
            return true;
        } else if (isArray(this.selections[key])) {
            return this.selections[key].includes(feature[key]);
        }
    }

    /**
     * Filters variations based on swatch image.
     * Swatch Image is unique across variations with multiple features
     * @param variation
     * @param self
     */
    filterDuplicateSwatches(variation, self) {
        let isValidSwatch;
        if (
            !self.swatchFilter.includes(variation.swatch_image) ||
            self.swatchFilter.length === 0
        ) {
            self.swatchFilter.push(variation.swatch_image);
            isValidSwatch = true;
            self.previousSwatch = variation;
        } else {
            if (
                variation.hasOwnProperty('enabled') &&
                !self.previousSwatch.enabled &&
                variation.enabled
            ) {
                isValidSwatch = true;
                self.swatchFilter.pop();
                self.swatchFilter.push(variation.swatch_image);
                self.previousSwatch = variation;
            } else {
                isValidSwatch = false;
            }
        }
        return isValidSwatch;
    }

    filterSwatches() {
        const variations = this.variations;

        if (this.selectionsExist && this.selectedSwatch.swatch_image) {
            // tslint:disable-next-line: forin
            // for (const keys in this.selectionOptions) {
            //   this.selectionOptions[keys] = false;
            // }
            // tslint:disable-next-line: forin
            for (const key in variations) {
                const value = variations[key];
                // console.log('value ', value);

                const options = value.features;
                // console.log('options ', options);

                // tslint:disable-next-line: forin
                for (const features in options) {
                    const feature = options[features];
                    // console.log('feature: ', feature);
                    // console.log('value.swatch_image ', value);
                    // console.log('this.selectedSwatch ', this.selectedSwatch);

                    if (feature && feature.charAt(0) !== '#') {
                        // console.log('filter feature: ', feature);
                        if (
                            this.selectionOptions.hasOwnProperty(feature) &&
                            value.swatch_image === this.selectedSwatch.swatch_image
                        ) {
                            this.selectionOptions[feature] = true;
                        }
                    }
                    // console.log('this.selectionOptions[feature]: ', this.selectionOptions);
                }
            }
        } else {
            // tslint:disable-next-line: forin
            for (const keys in this.selectionOptions) {
                this.selectionOptions[keys] = true;
            }
        }
    }

    checkSwatchActive() {
        if (
            this.selectedSwatch.swatch_image &&
            this.swatches.some(
                (data) => data.swatch_image === this.selectedSwatch.swatch_image
            )
        ) {
            this.priceData = {
                price: this.selectedSwatch.price,
                wasPrice: this.selectedSwatch.wasPrice,
            };
            this.setPrice.emit(this.priceData);
            this.setImage.emit(this.selectedSwatch);
        } else {
            this.selectedSwatch = {
                image: '',
                swatch_image: null,
                price: '',
                wasPrice: '',
            };
            this.setPrice.emit('');
            this.setImage.emit('');
            this.selectedIndex = null;
        }
    }
}
