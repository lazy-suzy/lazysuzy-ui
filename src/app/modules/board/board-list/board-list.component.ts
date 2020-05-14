import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Board } from '../board';
import { BoardService } from '../board.service';
import { boardRoutesNames } from '../board.routes.names';
import { BoardPopupComponent } from '../board-popup/board-popup.component';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';

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
    private route: ActivatedRoute,
    private dialog: MatDialog
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
          this.router.navigate([["..", this.boardViewLink, board.uuid].join('/')], { relativeTo: this.route, state: {
            justCreated: true
          } });
      });
  }

  delete(board: Board): void {
    board.is_active = false;
    this.boards = this.boards.filter(h => h !== board);
    this.boardService.updateBoard(new Board({
      uuid: board.uuid,
      is_active: 0
    })).subscribe();
  }

  share(board: Board): void {
    this.dialog.open(BoardPopupComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        type: "share",
        board: board
      },
      width: '40%',
    });
  }

  getPreviewImagePath(board: Board): string {
    if(board.preview)
      return environment.BASE_HREF + board.preview;
    else
      return "https://via.placeholder.com/500x400";
  }

}
