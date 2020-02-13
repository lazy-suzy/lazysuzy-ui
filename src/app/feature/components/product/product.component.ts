import { MOCK_PRODUCT } from './../../../mocks';
import { IProductPayload } from './../../../shared/models';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less'],
})
export class ProductComponent implements OnInit {
  @Input() product: IProductPayload;
  starIcons: string[] = new Array();

  ngOnInit(): void {
    this.setRating();
  }

  setRating(): void {
    let starCount: number = Math.round(this.product.rating * 2) / 2;
    while (starCount > 0.5) {
      this.starIcons.push('star');
      starCount -= 1;
    }
    if (starCount && this.starIcons.length < 5) {
      this.starIcons.push('star_half');
    } else if (this.starIcons.length < 5) {
      while (this.starIcons.length < 5) {
        this.starIcons.push('star_outline');
      }
    }
  }
}
