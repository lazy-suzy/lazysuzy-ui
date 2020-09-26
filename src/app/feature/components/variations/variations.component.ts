import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialogUtilsService } from 'src/app/shared/services';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
    BreakpointState,
    Breakpoints,
    BreakpointObserver
} from '@angular/cdk/layout';
@Component({
    selector: 'app-variations',
    templateUrl: './variations.component.html',
    styleUrls: ['./variations.component.less']
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
    swatches = [];
    filteredVariations = [];
    swatchFilter = [];
    selections = {};
    selectedIndex: number;
    priceData = {
        price: '',
        wasPrice: ''
    };
    selectionsExist: boolean;
    bpSubscription: Subscription;
    isHandset: boolean;
    selectionOptions = {};
    selectedSwatch = {
        image: '',
        swatch_image: null,
        price: '',
        wasPrice: ''
    };
    previousSwatch;

    constructor(
        private router: Router,
        private matDialogUtils: MatDialogUtilsService,
        private breakpointObserver: BreakpointObserver
    ) {}

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

        console.log('swatches: ', this.swatches);
        console.log('inputSelections: ', this.inputSelections);
        console.log('Object.values(this.inputSelections): ', Object.values(this.inputSelections));
        var countSingleSelect = 0;
        if (this.inputSelections['type'] === 'redirect') {
            this.setSelectionChecked.emit(true);
        } else {
            for (let item in this.inputSelections) {
                this.inputSelections[item]['selected'] = false;
                if (this.inputSelections[item]["select_type"] === "single_select") {
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
                wasPrice: variation.was_price
            };
            this.selectedIndex = index;
            this.priceData = {
                price: variation.price,
                wasPrice: variation.was_price
            };
            this.setPrice.emit(this.priceData);
            this.setImage.emit(variation);
            this.updateSwatches();
            this.filterSwatches();
        }
        this.selections = {};
        for (let item in this.inputSelections) {
            if (this.inputSelections[item]["select_type"] === "single_select") {
                // this.selections[item] = this.inputSelections[item]["options"].find((option) => this.selectionOptions[option]);
                let enableOptions = this.inputSelections[item]["options"].filter((option) => this.selectionOptions[option]);
                if (enableOptions.length === 1) {
                    this.selections[item] = enableOptions[0];
                    this.inputSelections[item]['selected'] = true;
                } else {
                    this.inputSelections[item]['selected'] = false;
                }
            }
        }
        this.selectionEmit();
    }

    selectionEmit() {
        this.beforeSelection = true;
        this.selectedFlag = false;
        for (let selected in this.inputSelections) {
            if (this.inputSelections[selected]['select_type'] === "single_select") {
                this.beforeSelection = this.beforeSelection && this.inputSelections[selected]['selected'];
                this.selectedFlag = this.selectedFlag || this.inputSelections[selected]['selected'];
            }
        }
        console.log('beforeSelection: ', this.beforeSelection);

        this.setSelectionChecked.emit(this.beforeSelection);
    }

    selectedOption(option: string, type: string) {
        console.log('this.selections: ', this.selections);
        console.log('option: ', option);
        console.log('type: ', type);
        if (this.selections[type] === option) {
            delete this.selections[type];
            this.inputSelections[type]['selected'] = false;
        } else {
            this.selections[type] = option;
            this.inputSelections[type]['selected'] = true;
        }

        this.selectionEmit();

        console.log('inputSelections: ', this.inputSelections);
        console.log('selectedSwatch.swatch_image: ', this.selectedSwatch.swatch_image);
        console.log('selectedSwatch.swatch_image: ', Boolean(this.selectedSwatch.swatch_image));

        this.updateSwatches();
    }

    onCheckChange(event, option: string, type: string) {
        console.log('event: ', event);
        console.log('option: ', option);
        console.log('type: ', type);
        console.log('this.swatches: ', this.swatches);

        if (event.source.checked) {
            if (this.selections[type]) {
                this.selections[type].push(option);
            } else {
                this.selections[type] = [option];
            }
        } else {
            const optionsArr = this.selections[type].filter(
                (value: string) => value !== option
            );
            this.selections[type] = optionsArr;
            if (this.selections[type].length < 1) {
                delete this.selections[type];
            }
        }
        this.updateSwatches();
    }

    clearVariations() {
        this.clearSelection.emit(true);
        this.selections = {};
        this.selectedIndex = null;
        this.setPrice.emit('');
        this.setImage.emit('');
        this.setSelectionChecked.emit(false);
        for (let item in this.inputSelections) {
            this.inputSelections[item]['selected'] = false;
        }
        this.selectionEmit();
        this.selectedSwatch = {
            image: '',
            swatch_image: null,
            price: '',
            wasPrice: ''
        };
        this.selectedFlag = false;
        // this.beforeSelection = true;
        this.setSelection.emit(true);
        this.filterSwatches();
        this.updateSwatches();
        console.log('hasSelection: ', this.hasSelection);
    }

    updateSwatches() {
        const self = this;
        self.swatchFilter = [];
        const filteredSwatches = ([] = this.variations
            .map((variation) => {
                return {
                    ...variation,
                    enabled: self.checkSwatchSelection(variation, self)
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
            // const temp = this.variations.map((variation) => {
            //     const features = variation.features;
            //     for (const key in this.selections) {
            //         if (this.selections[key] === features[key] || this.selections[key].includes(features[key])) {
            //             variation.enabled = true;
            //         } else {
            //             variation.enabled = false;
            //             break;
            //         }
            //     }
            //     return variation;
            // }).filter(variation => variation.enabled);
            // console.log(temp);
            // this.swatches = [];
            // this.variations.forEach(variation => {
            //     if (this.swatches.includes(variation.swatch_image)) {
            //         if (!variation.enabled) {
            //             const index = this.swatches.indexOf(variation.swatch_image);
            //             this.swatches.splice(index, 1, variation.swatch_image);
            //         }
            //     } else {
            //         this.swatches.push(variation.swatch_image);
            //     }
            // });
            // console.log(this.swatches)
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
            // const temp = this.variations.filter(({features}) => {
            //     for (const key in this.selections) {
            //         if (this.selections[key] === features[key] || this.selections[key].includes(features[key])) {
            //             return true;
            //         }
            //     }
            //     return false;
            // });
            // console.log(temp);
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
                wasPrice: this.filteredVariations[0].was_price
            };
            this.setPrice.emit(this.priceData);
            this.setImage.emit(this.filteredVariations[0]);
        } else {
            this.checkSwatchActive();
        }
    }

    checkSwatchSelection(variation, self) {
        let isValidVariation = true;
        for (const key in self.selections) {
            if (
                variation.features[key] === self.selections[key] ||
                self.selections[key].includes(variation.features[key])
            ) {
                isValidVariation = true;
            } else {
                isValidVariation = false;
                break;
            }
        }
        return isValidVariation;
    }

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
            for (const keys in this.selectionOptions) {
                this.selectionOptions[keys] = false;
            }
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
                wasPrice: this.selectedSwatch.wasPrice
            };
            this.setPrice.emit(this.priceData);
            this.setImage.emit(this.selectedSwatch);
        } else {
            this.selectedSwatch = {
                image: '',
                swatch_image: null,
                price: '',
                wasPrice: ''
            };
            this.setPrice.emit('');
            this.setImage.emit('');
            this.selectedIndex = null;
        }
    }
}
