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
import { EventEmitterService, UtilsService } from 'src/app/shared/services';
import { Subscription, Observable } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.less', '../board.component.less']
})
export class BoardListComponent implements OnInit {
  boards: Board[] = [];
  boardViewLink = boardRoutesNames.BOARD_VIEW;
  boardPreviewLink = boardRoutesNames.BOARD_PREVIEW;
  isFetching = false;
  isFirstBoot = true;
  eventSubscription: Subscription;
  user = null;
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );

  bpSubscription: Subscription;
  isHandset = false;
  isAnyPublished = false;

  constructor(
    private boardService: BoardService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private eventEmitterService: EventEmitterService,
    private snackBar: MatSnackBar,
    private utils: UtilsService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        // if it has been called previously for every new change create a snackbar
        if (!this.isFirstBoot) {
          this.isFetching = true;
          this.snackBar.open(
            user.name ? 'Welcome back ' + user.name : 'Now browsing as guest',
            'Dismiss',
            {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            }
          );
          this.user = user;
        }
        this.isFirstBoot = false;
        this.user = JSON.parse(localStorage.getItem('user'));
        this.getBoards();
      });

    this.eventEmitterService.userTransitionEvent.subscribe(
      () => (this.isFetching = true)
    );
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
  }
  onDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
  getBoards(): void {
    this.boardService.getBoards().subscribe((response) => {
      this.boards = response.reverse();
      this.isAnyPublished =
        this.boards.filter((b) => b.is_published === 1).length > 0;
      this.isFetching = false;
    });
  }

  add(board: Board = new Board()): void {
    let redirect = false;
    const newBoard = Object.assign({}, board);
    if (newBoard.title) {
      newBoard.title = 'Copy of ' + newBoard.title;
    } else {
      const datePipe = new DatePipe('en-US');
      newBoard.title = 'Untitled Board';
      // newBoard.title = "Untitled Board " + datePipe.transform(new Date(), 'MM/dd/yyyy hh:mm:ss');
      redirect = true;
    }

    newBoard.type_privacy = newBoard.is_published = 0;
    
    // tslint:disable-next-line: no-shadowed-variable
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
        if (result === true) {
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
    if (board.type_privacy == 0){
      board.type_privacy = 1;
      this.boardService.updateBoard(board).subscribe();
    }
    this.dialog.open(BoardPopupComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        type: 'share',
        board
      },
      width: '40%'
    });
  }

  getPreviewImagePath(board: Board) {
    if (board.preview) {
      return environment.BASE_HREF + board.preview;
    } else {
      return 'https://via.placeholder.com/500x400';
    }
  }

  openSignupDialog() {
    this.utils.openSignupDialog(this.isHandset);
  }
}
