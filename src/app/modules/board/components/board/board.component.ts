import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { BoardService } from 'src/app/shared/services/board/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less']
})
export class BoardComponent implements OnInit {

  currentBoardProducts = [];

  constructor(
    private boardService: BoardService
  ) { }

  ngOnInit(): void {
    this.boardService.initBoard('');
    this.currentBoardProducts = this.boardService.currentBoardProducts;
  }

}
