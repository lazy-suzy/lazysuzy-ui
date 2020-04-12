import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { FormBuilder } from '@angular/forms';
import { MidPanelComponent } from '../mid-panel/mid-panel.component';
import { BrowsefilterComponent } from '../browse-filter/browse-filter.component';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.less']
})
export class BrowseComponent implements OnInit {

  products = [];
  showLoader: boolean = false;
  filterForm: any;
  mockDataForProducts = [{
    DisplayDesc: 'DisplayDesc1',
    value: 'displayDesc1'
  },
  {
    DisplayDesc: 'DisplayDesc2',
    value: 'displayDesc2'
  }];

  mockDataForColor = [{
    DisplayDesc: 'DisplayDesc1',
    value: 'displayDesc1'
  },
  {
    DisplayDesc: 'DisplayDesc2',
    value: 'displayDesc2'
  }];

  someValue = 0;
  min = 0;
  max = 10000;
  @ViewChild('browsefilter', { static: false }) browsefilter?: OverlayPanel;

  @Output() updatesFromBrowse: EventEmitter<any> = new EventEmitter();
  @Output() previewProduct: EventEmitter<any> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.apiService.getBrowseTabData('201').subscribe((s: any) => {
      this.products = s.products;
      this.showLoader = false;
    });
  }

  handleUpdatesFromFilter(event) {
    if (event.name === 'TOGGLE_FILTER_OVERLAY' && !event.value) {
      this.browsefilter.hide();
    }
  }

  handlePreviewProduct(product) {
    this.previewProduct.emit(product);
  }

}
