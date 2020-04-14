import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UtilsService } from 'src/app/shared/services';

@Component({
  selector: 'app-variations',
  templateUrl: './variations.component.html',
  styleUrls: ['./variations.component.less']
})
export class VariationsComponent implements OnInit {
  @Output() setImage = new EventEmitter<any>();
  @Output() setPrice = new EventEmitter<any>();
  @Output() setSwatches = new EventEmitter<any>();
  @Input() variations = [];
  @Input() inputSelections = {};
  @Input() isSwatchExist = false;
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
  constructor(private utils: UtilsService) {}

  ngOnInit() {
    this.selectionsExist = Object.keys(this.inputSelections)[0] !== 'type';
    this.filteredVariations = this.variations;
    this.filterSwatches(this.variations);
  }

  // selectedVariation(variation, index: number) {
  //   if (variation.has_parent_sku) {
  //     this.utils.openVariationDialog(variation.variation_sku);
  //   } else {
  //     this.selectedIndex = index;
  //     this.priceData = {
  //       price: variation.price,
  //       wasPrice: variation.was_price,
  //     };
  //     this.setPrice.emit(this.priceData);
  //     this.setImage.emit(variation.image);
  //   }
  // }

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
    this.filterSwatches(this.variations);
  }

  updateSwatches() {
    const _self = this;
    const selectedBasedSwatches = this.variations.filter(function(variation) {
      if (variation.swatch_image !== null) {
        return _self.checkSwatchSelection(variation, _self);
      }
    });
    this.filterSwatches(selectedBasedSwatches);
    this.filteredVariations = this.variations.filter(function(variation) {
      return _self.checkSwatchSelection(variation, _self);
    });
    if (this.filteredVariations.length === 1) {
      this.priceData = {
        price: this.filteredVariations[0].price,
        wasPrice: this.filteredVariations[0].was_price
      };
      this.setPrice.emit(this.priceData);
      this.setImage.emit(this.filteredVariations[0].image);
    } else {
      this.setImage.emit('');
    }
  }

  checkSwatchSelection(variation, _self) {
    let isValidVariation = true;
    for (const key in _self.selections) {
      if (
        variation.features[key] === _self.selections[key] ||
        _self.selections[key].includes(variation.features[key])
      ) {
        isValidVariation = true;
      } else {
        isValidVariation = false;
        break;
      }
    }
    return isValidVariation;
  }

  filterSwatches(variations) {
    var _self = this;
    this.swatchFilter = [];
    this.swatches = variations.filter(function(variation) {
      let isValidSwatch;
      if (variation.swatch_image !== null) {
        if (
          !_self.swatchFilter.includes(variation.swatch_image) ||
          _self.swatchFilter.length === 0
        ) {
          _self.swatchFilter.push(variation.swatch_image);
          isValidSwatch = true;
        } else {
          isValidSwatch = false;
        }
      } else {
        isValidSwatch = false;
      }
      return isValidSwatch;
    });
    this.setSwatches.emit(this.swatches);
  }
}
