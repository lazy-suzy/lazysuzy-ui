import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/shared/services/board/board.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-board-container',
  templateUrl: './board-container.component.html',
  styleUrls: ['./board-container.component.less']
})
export class BoardContainerComponent implements OnInit {

  showLoader: boolean = false;

  constructor(public boardService: BoardService) { }

  ngOnInit(): void {

    //Jquery is available to be used as $
    console.log('Jquery is available' + $);

    //Sample Http Call
    this.showLoader = true;
    this.boardService.getSomeDataSample().subscribe(s => {
      this.showLoader = false;
    });
  }

}
