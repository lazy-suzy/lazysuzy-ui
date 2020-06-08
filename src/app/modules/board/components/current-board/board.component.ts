import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { BoardService } from 'src/app/shared/services/board/board.service';

@Component({
  selector: 'app-current-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less', './../../board.component.less']
})
export class CurrentBoardComponent implements OnInit {
  @Input() boardProducts: any = [];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (
      changes['boardProducts'] &&
      changes['boardProducts'].previousValue !==
        changes['boardProducts'].currentValue
    ) {
      let boardProducts = changes['boardProducts'].currentValue || [];
      this.boardProducts = [...boardProducts] || [];
    }
  }
  updatePriceFormat(price, max) {
    let minPrice: string = '';
    let maxPrice: string = '';
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    let splitedPrice = price.split('-');
    minPrice = formatter.format(splitedPrice[0].slice(1));
    if (splitedPrice.length > 1) {
      if (max) {
        maxPrice = formatter.format(splitedPrice[1]);
        return `- ${maxPrice.slice(0, -3)}`;
      } else {
        return `${minPrice.slice(0, -3)}`;
      }
    } else {
      if (max) {
        return null;
      } else {
        return `${minPrice.slice(0, -3)}`;
      }
    }
  }
}
