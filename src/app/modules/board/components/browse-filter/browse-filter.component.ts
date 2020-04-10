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

  @Output() updatesFromBrowse: EventEmitter<any> = new EventEmitter();
  @Output() addProduct: EventEmitter<any> = new EventEmitter();

  productsDropdown: any[];
  selectedProductsDropdown: any[] = [];

  productsColors: any[];
  selectedProductsColor: any[] = [];

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService
  ) {
    this.boardService.getProductsDropdown().subscribe(s => {
      this.productsDropdown = s;
    });
    this.boardService.getProductsDropdown().subscribe(s => {
      this.productsColors = s;
    });
  }

  ngOnInit(): void {
    this.showLoader = true;
    this.createForm();
    this.showLoader = false;
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

}
