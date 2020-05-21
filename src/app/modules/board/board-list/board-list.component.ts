import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Board } from '../board';
import { BoardService } from '../board.service';
import { boardRoutesNames } from '../board.routes.names';
import { BoardPopupComponent } from '../board-popup/board-popup.component';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import { BoardPopupConfirmComponent } from '../board-popup-confirm/board-popup-confirm.component';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.less', '../board.component.less']
})
export class BoardListComponent implements OnInit {
  boards: Board[] = [];
  boardViewLink = boardRoutesNames.BOARD_VIEW;
  boardPreviewLink = boardRoutesNames.BOARD_PREVIEW;
  isFetching: boolean = false;
  constructor(
    private boardService: BoardService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.isFetching = true;
    this.getBoards();
  }

  getBoards(): void {
    this.boardService.getBoards()
      .subscribe(response => this.boards = response.reverse());
    this.isFetching = false;
  }

  add(board: Board = new Board()): void {
    let redirect = false;
    let newBoard = Object.assign({}, board);
    if (newBoard.title)
      newBoard.title = 'Copy of ' + newBoard.title;
    else {
      var datePipe = new DatePipe('en-US');
      newBoard.title = "Untitled Board";
      // newBoard.title = "Untitled Board " + datePipe.transform(new Date(), 'MM/dd/yyyy hh:mm:ss');
      redirect = true;
    }

    this.boardService.addBoard(newBoard)
      .subscribe(board => {
        if (board.uuid){
          if (redirect){
            this.router.navigate([["..", this.boardViewLink, board.uuid].join('/')], { relativeTo: this.route, state: {
              justCreated: true
            }});
          }
          else {
            this.boards.unshift(board);
          }
        }
      });
  }

  delete(board: Board): void {
    this.dialog.open(BoardPopupConfirmComponent, {
      data: {
        title: "Are you sure you want to delete?",
        optionConfirm: "Delete"
      }
    }).afterClosed().subscribe(result => {
      if (result == true) {
        board.is_active = false;
        this.boards = this.boards.filter(h => h !== board);
        this.boardService.updateBoard(new Board({
          uuid: board.uuid,
          is_active: 0
        })).subscribe();
      }
    });
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
