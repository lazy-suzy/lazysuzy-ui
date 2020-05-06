import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { BoardService } from 'src/app/shared/services/board/board.service';

@Component({
  selector: 'app-current-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less']
})
export class CurrentBoardComponent implements OnInit {

  @Input() boardProducts: any = [];

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: any) {
    if (changes['boardProducts'] && changes['boardProducts'].previousValue !== changes['boardProducts'].currentValue) {
      let boardProducts = changes['boardProducts'].currentValue || [];
      this.boardProducts = [...boardProducts] || [];
    }
  }

}
