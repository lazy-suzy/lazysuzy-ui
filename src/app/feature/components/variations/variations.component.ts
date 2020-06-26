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
  @Input() variations = [];
  @Input() inputSelections = {};
  @Input() isSwatchExist = false;
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
  }
  onDestroy(): void {
    this.bpSubscription.unsubscribe();
  }
  selectedVariation(variation, index: number) {
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
  }

  selectedOption(option: string, type: string) {
    if (this.selections[type] === option) {
      delete this.selections[type];
    } else {
      this.selections[type] = option;
    }

    this.updateSwatches();
  }

  onCheckChange(event, option: string, type: string) {
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
    this.selections = {};
    this.selectedIndex = null;
    this.setPrice.emit('');
    this.setImage.emit('');
    this.selectedSwatch = {
      image: '',
      swatch_image: null,
      price: '',
      wasPrice: ''
    };
    this.filterSwatches();
    this.updateSwatches();
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
        const options = value.features;
        // tslint:disable-next-line: forin
        for (const features in options) {
          const feature = options[features];
          if (feature && feature.charAt(0) !== '#') {
            if (
              this.selectionOptions.hasOwnProperty(feature) &&
              value.swatch_image === this.selectedSwatch.swatch_image
            ) {
              this.selectionOptions[feature] = true;
            }
          }
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
