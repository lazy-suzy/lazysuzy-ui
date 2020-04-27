import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
// import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { BoardService } from 'src/app/shared/services/board/board.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.less']
})
export class BrowseComponent implements OnInit {

  products = [];
  showLoader: boolean = false;
  filterForm: any;

  someValue = 0;
  min = 0;
  max = 10000;

  selectedCategory = null;

  // @ViewChild('browsefilter', { static: false }) browsefilter?: OverlayPanel;
  @Output() updatesFromBrowse: EventEmitter<any> = new EventEmitter();
  @Output() goToSelect: EventEmitter<any> = new EventEmitter();
  @Output() previewProduct: EventEmitter<any> = new EventEmitter();

  constructor(
    public boardService: BoardService
  ) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.selectedCategory = { ...this.boardService.state.selectedCategory };
    this.boardService.getBrowseTabData(this.selectedCategory).subscribe((s: any) => {
      this.boardService.setFilterData(this.selectedCategory, s.filterData || {});
      this.products = [...(s.products) || []];
      this.showLoader = false;
    });
  }

  handleGoToSelect(event) {
    this.goToSelect.emit(event);
  }

  handleUpdatesFromFilter(event) {
    if (event.name === 'TOGGLE_FILTER_OVERLAY' && !event.value) {
      // this.browsefilter.hide();
    }
  }

  handlePreviewProduct(product) {
    this.previewProduct.emit(product);
  }

}
