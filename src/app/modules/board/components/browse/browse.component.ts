import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.less']
})
export class BrowseComponent implements OnInit {

  products = [];

  @Output() updatesFromBrowse: EventEmitter<any> = new EventEmitter();
  @Output() addProduct: EventEmitter<any> = new EventEmitter();
  showLoader: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.apiService.getBrowseTabData('201').subscribe((s: any) => {
      this.products = s.products;
      this.showLoader = false;
    });
  }

  addProductToBoard(product) {
    this.addProduct.emit(product);
  }

}
