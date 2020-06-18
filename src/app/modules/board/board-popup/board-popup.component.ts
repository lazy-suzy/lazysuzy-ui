import { Component, OnInit, Inject, Optional } from '@angular/core';
import { boardRoutesNames } from '../board.routes.names';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { BoardService } from '../board.service';
import { Board } from '../board';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-board-popup',
  templateUrl: './board-popup.component.html',
  styleUrls: ['../board.component.less', './board-popup.component.less']
})
export class BoardPopupComponent implements OnInit {
  roomTypeOptions = [];
  roomTypeOptionSelected = -1;

  roomStyleOptions = [];
  roomStyleOptionSelected = -1;

  popupShow = {
    config: false,
    publish: false,
    share: false
  };

  isOptionSelected: boolean = false;

  board: Board = new Board();
  boardPrivacy : boolean = false;

  loadedIndependantly = false;
  forceReturnRoute;
  boardShareURL;
  boardEmbedURL;
  boardEmbedCode;
  pinterestURL;
  previewImageURL;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
    @Optional() private dialogRef: MatDialogRef<BoardPopupComponent>,
    private router: Router,
    private route: ActivatedRoute,
    private boardService: BoardService
  ) {
    if (data) {
      if (data.type) {
        if (data.type == 'publish') {
          this.popupShow.config = true;
        } else if (data.type == 'share') this.popupShow.share = true;
      }
      if (data.forceReturnRoute) this.forceReturnRoute = data.forceReturnRoute;
    }
  }

  ngOnInit() {
    this.getRoomTypeAndStyleOptions(() => {
      const uuid = this.route.snapshot.paramMap.get('uuid');
      if (this.data && this.data.board) {
        delete this.data.board.state;
        this.setBoard(this.data.board);
      } else if (uuid) {
        this.boardService.getBoardByID(uuid).subscribe((response) => {
          if (response) {
            this.loadedIndependantly = true;
            this.popupShow.share = true;
            this.setBoard(response[0]);
          }
        });
      } else return;
    });

    if (this.dialogRef)
      this.dialogRef
        .beforeClose()
        .subscribe(() =>
          this.forceReturnRoute
            ? this.router.navigate([
                [environment.BOARD_BASE_HREF, this.forceReturnRoute].join('/')
              ])
            : ''
        );
  }

  getRoomTypeAndStyleOptions(callback): void {
    let roomTypeAndStyleOptions = [
      {
        code: 111,
        label: 'Room',
        value: 'Living'
      },
      {
        code: 112,
        label: 'Room',
        value: 'Bedroom'
      },
      {
        code: 113,
        label: 'Room',
        value: 'Dining'
      },
      {
        code: 114,
        label: 'Room',
        value: 'Office'
      },
      {
        code: 115,
        label: 'Room',
        value: 'Nursery/Kids'
      },
      {
        code: 116,
        label: 'Room',
        value: 'Other'
      },
      {
        code: 121,
        label: 'Style',
        value: 'Modern'
      },
      {
        code: 122,
        label: 'Style',
        value: 'Mid-Century'
      },
      {
        code: 123,
        label: 'Style',
        value: 'Contemporary'
      },
      {
        code: 124,
        label: 'Style',
        value: 'Traditional'
      },
      {
        code: 125,
        label: 'Style',
        value: 'Bohemian'
      },
      {
        code: 126,
        label: 'Style',
        value: 'Minamalist'
      },
      {
        code: 127,
        label: 'Style',
        value: 'Other'
      }
    ];

    this.roomTypeOptions = roomTypeAndStyleOptions.filter(
      (o) => o.label == 'Room'
    );
    this.roomStyleOptions = roomTypeAndStyleOptions.filter(
      (o) => o.label == 'Style'
    );

    if (callback) callback();
  }

  selectRoomType(index: number) {
    this.board.type_room = this.roomTypeOptions[index].code;
    this.roomTypeOptionSelected = index;
    this.isOptionSelected =
      this.board.type_room !== null && this.board.type_style !== null;
  }
  selectRoomStyle(index: number) {
    this.board.type_style = this.roomStyleOptions[index].code;
    this.roomStyleOptionSelected = index;
    this.isOptionSelected =
      this.board.type_room !== null && this.board.type_style !== null;
  }

  setBoard(board: Board) {
    this.board = board;
    this.roomTypeOptions.forEach((o, i) => {
      if (o.code == this.board.type_room) this.roomTypeOptionSelected = i;
    });
    this.roomStyleOptions.forEach((o, i) => {
      if (o.code == this.board.type_style) this.roomStyleOptionSelected = i;
    });

    this.isOptionSelected =
      this.board.type_room !== null && this.board.type_style !== null;

    this.boardShareURL = [
      environment.SITE_URL,
      environment.BOARD_BASE_HREF,
      boardRoutesNames.BOARD_PREVIEW,
      board.uuid
    ].join('/');
    this.boardEmbedURL = [
      environment.SITE_URL,
      environment.BOARD_BASE_HREF,
      boardRoutesNames.BOARD_EMBED,
      board.uuid
    ].join('/');
    this.previewImageURL = environment.BASE_HREF + board.preview;
    this.boardEmbedCode = `<iframe src="${this.boardEmbedURL}" scrolling="no" frameborder="no" align="center"></iframe>`;
    this.pinterestURL = `http://pinterest.com/pin/create/button/?url=${this.boardShareURL}&media=${this.previewImageURL}&description=${this.board.title}`;
  }
  updatePrivacy() {
    this.boardPrivacy = !this.boardPrivacy;
  }
  publishBoard() {
    this.popupShow.config = false;
    this.board.type_privacy = this.boardPrivacy ? 0 : 2;
    this.board.is_published = true;
    this.boardService.updateBoard(this.board).subscribe((response) => {
      this.popupShow.publish = true;
    });
  }

  handleExit(action, value) {
    if (this.dialogRef) this.dialogRef.close();

    if (action == 'navigate') {
      if (value == 'list')
        this.router.navigate([
          [environment.BOARD_BASE_HREF, boardRoutesNames.BOARD_LIST].join('/')
        ]);
      else if (value == 'shop')
        this.router.navigate([
          [
            environment.BOARD_BASE_HREF,
            boardRoutesNames.BOARD_PREVIEW,
            this.board.uuid
          ].join('/')
        ]);
    }
  }

  closePopup() {
    if (this.dialogRef) this.dialogRef.close();
  }

  showShare() {
    this.popupShow.publish = this.popupShow.config = false;
    this.popupShow.share = true;
    this.forceReturnRoute = boardRoutesNames.BOARD_LIST;
  }
}
