import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BoardService } from 'src/app/shared/services/board/board.service';

@Component({
  selector: 'app-browse-filter',
  templateUrl: './browse-filter.component.html',
  styleUrls: ['./browse-filter.component.less']
})
export class BrowsefilterComponent implements OnInit {

  showLoader: boolean = false;
  filterForm: any;

  someValue = 0;
  min = 0;
  max = 10000;

  productsDropdown: any[];
  selectedProductsDropdown: any[] = [];

  productsColors: any[];
  selectedProductsColor: any[] = [];

  @Output() updatesFromFilter: EventEmitter<any> = new EventEmitter();
  @Output() addProduct: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.showLoader = true;
    this.boardService.getProductsDropdown().subscribe(s => {
      this.productsDropdown = s;
      this.showLoader = false;
    });
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    return value;
  }

  createForm() {
    this.filterForm = this.fb.group({
      brand: [],
      price: 0,
      color: []
    });
    this.filterForm.valueChanges.subscribe(val => {
      console.log("value", val);
    });
  }

  addProductToBoard(product) {
    this.addProduct.emit(product);
  }

  applyFilters() {
    console.log('applyFilters');
    this.showLoader = true;
    this.boardService.saveAddViaUrl(event).subscribe(s => {
      this.showLoader = false;
      this.updatesFromFilter.emit({
        name: 'TOGGLE_FILTER_OVERLAY',
        value: false
      });
    });
  }

}
