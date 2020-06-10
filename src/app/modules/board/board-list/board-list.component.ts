import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Board } from '../board';
import { BoardService } from '../board.service';
import { boardRoutesNames } from '../board.routes.names';
import { BoardPopupComponent } from '../board-popup/board-popup.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { BoardPopupConfirmComponent } from '../board-popup-confirm/board-popup-confirm.component';
import { EventEmitterService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
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
  isFirstBoot: boolean = true;
  eventSubscription: Subscription;
  constructor(
    private boardService: BoardService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private eventEmitterService: EventEmitterService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        // if it has been called previously for every new change create a snackbar
        if (!this.isFirstBoot) {
          this.isFetching = true;
          this._snackBar.open(
            user.name ? 'Welcome back ' + user.name : 'Now browsing as guest',
            'Dismiss',
            {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            }
          );
        }
        this.isFirstBoot = false;
        this.getBoards();
      });

    this.eventEmitterService.userTransitionEvent.subscribe(
      () => (this.isFetching = true)
    );
  }
  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
  getBoards(): void {
    this.boardService.getBoards().subscribe((response) => {
      this.boards = response.reverse();
      this.isFetching = false;
    });
  }

  add(board: Board = new Board()): void {
    let redirect = false;
    let newBoard = Object.assign({}, board);
    if (newBoard.title) newBoard.title = 'Copy of ' + newBoard.title;
    else {
      var datePipe = new DatePipe('en-US');
      newBoard.title = 'Untitled Board';
      // newBoard.title = "Untitled Board " + datePipe.transform(new Date(), 'MM/dd/yyyy hh:mm:ss');
      redirect = true;
    }

    this.boardService.addBoard(newBoard).subscribe((board) => {
      if (board.uuid) {
        if (redirect) {
          this.router.navigate(
            [['..', this.boardViewLink, board.uuid].join('/')],
            {
              relativeTo: this.route,
              state: {
                justCreated: true
              }
            }
          );
        } else {
          this.boards.unshift(board);
        }
      }
    });
  }

  delete(board: Board): void {
    this.dialog
      .open(BoardPopupConfirmComponent, {
        data: {
          title: 'Are you sure you want to delete?',
          optionConfirm: 'Delete'
        }
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == true) {
          board.is_active = false;
          this.boards = this.boards.filter((h) => h !== board);
          this.boardService
            .updateBoard(
              new Board({
                uuid: board.uuid,
                is_active: 0
              })
            )
            .subscribe();
        }
      });
  }

  share(board: Board): void {
    this.dialog.open(BoardPopupComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        type: 'share',
        board: board
      },
      width: '40%'
    });
  }

  getPreviewImagePath(board: Board): string {
    if (board.preview) return environment.BASE_HREF + board.preview;
    else return 'https://via.placeholder.com/500x400';
  }
}
