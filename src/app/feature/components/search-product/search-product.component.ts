import { Component, OnInit, Input } from '@angular/core';
import { ISearchProduct } from './../../../shared/models';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.less']
})
export class SearchProductComponent implements OnInit {
  @Input() product: ISearchProduct;
  starIcons: string[] = new Array();

  constructor() {}

  ngOnInit(): void {
    this.setRating();
  }

  setRating(): void {
    // let starCount: number = Math.round(this.product.rating * 2) / 2;
    // while (starCount > 0.5) {
    //   this.starIcons.push('star');
    //   starCount -= 1;
    // }
    // if (starCount && this.starIcons.length < 5) {
    //   this.starIcons.push('star_half');
    // } else if (this.starIcons.length < 5) {
    //   while (this.starIcons.length < 5) {
    //     this.starIcons.push('star_outline');
    //   }
    // }
  }
}
