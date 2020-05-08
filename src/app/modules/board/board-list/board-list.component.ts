import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Board } from '../board';
import { BoardService } from '../board.service';
import { boardRoutesNames } from '../board.routes.names';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.less', '../board.component.less']
})
export class BoardListComponent implements OnInit {
  boards: Board[] = [];
  boardViewLink = boardRoutesNames.BOARD_VIEW;
  boardPreviewLink = boardRoutesNames.BOARD_PREVIEW;

  constructor(
    private boardService: BoardService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getBoards();
  }

  getBoards(): void {
    this.boardService.getBoards()
      .subscribe(response => this.boards = response);
  }

  add(board: Board = new Board()): void {
    if (board.title)
      board.title = 'Copy of ' + board.title;
    else {
      var datePipe = new DatePipe('en-US');
      board.title = "Untitled Board " + datePipe.transform(new Date(), 'MM/dd/yyyy hh:mm:ss');
    }

    this.boardService.addBoard(board)
      .subscribe(board => {
        if (board.uuid)
          this.router.navigate([["..", this.boardViewLink, board.uuid].join('/')], { relativeTo: this.route });
      });
  }

  delete(board: Board): void {
    board.is_active = false;
    this.boards = this.boards.filter(h => h !== board);
    this.boardService.updateBoard(board).subscribe();
  }

}
