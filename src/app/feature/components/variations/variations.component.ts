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
  @Input() variations = [];
  @Input() inputSelections = {};
  @Input() isSwatchExist = false;
  swatches = [];
  filteredVariations = [];
  selections = {};
  selectedIndex: number;
  constructor(private utils: UtilsService) {}

  ngOnInit() {
    this.filteredVariations = this.variations;
    this.swatches = this.variations.filter(
      variation => variation.swatch_image !== null
    );
  }

  selectedVariation(variation, index: number) {
    if (variation.has_parent_sku) {
      this.utils.openVariationDialog(variation.variation_sku);
    } else {
      this.selectedIndex = index;
      this.setImage.emit(variation.image);
    }
  }

  selectedOption(option: string, type: string) {
    if (this.selections[type] == option) {
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
    this.updateSwatches();
  }

  updateSwatches() {
    var _self = this;
    this.swatches = this.variations.filter(function(variation) {
      if (variation.swatch_image !== null) {
        return _self.checkSwatchSelection(variation, _self);
      }
    });

    this.filteredVariations = this.variations.filter(function(variation) {
      return _self.checkSwatchSelection(variation, _self);
    });
    if (this.filteredVariations.length === 1) {
      this.setPrice.emit(this.filteredVariations[0].price);
      this.setImage.emit(this.filteredVariations[0].image);
    } else {
      this.setPrice.emit('');
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
}
