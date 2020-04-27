import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mid-panel',
  templateUrl: './mid-panel.component.html',
  styleUrls: ['./mid-panel.component.less']
})
export class MidPanelComponent implements OnInit {

  @Input() selectedItem: any = [];
  @Input() data: any = [];

  @Output() updates: EventEmitter<any> = new EventEmitter();
  @Output() addProduct: EventEmitter<any> = new EventEmitter();
  @Output() textActions: EventEmitter<any> = new EventEmitter();
  @Output() updatesFromSelect: EventEmitter<any> = new EventEmitter();

  productForPreview = null;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: any) {
    if (
      changes['selectedItem'] &&
      changes['selectedItem'].previousValue !== changes['selectedItem'].currentValue
    ) {
      this.selectedItem = changes['selectedItem'].currentValue;
    }
  }

  handleUpdatesFromBrowse($event) {
    this.updates.emit($event);
  }

  handlePreviewProductToBoardUpdates(product) {
    this.productForPreview = { ...product };
  }

  handleAddProductBoardPreview(product) {
    this.addProduct.emit(product);
  }

  handleUpdatesFromText(event) {
    this.textActions.emit(event);
  }

  handleClearProductPreview(product) {
    this.productForPreview = null;
  }

  handleGoToSelect(event) {
    this.updates.emit({
      name: 'GO_TO',
      payload: {
        name: 'Select',
        label: 'Select',
        value: 'Select'
      }
    });
  }

  handleGoToCategory(event) {
    this.updatesFromSelect.emit(event);
  }

}
