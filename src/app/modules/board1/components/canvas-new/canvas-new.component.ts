import { Component, OnInit } from '@angular/core';
// import * as fb from './fb.min.js';
import { BoardService } from 'src/app/shared/services/board/board.service.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
declare const fb: any;
import * as $ from 'jquery';
import * as Handlebars from 'handlebars/dist/cjs/handlebars';

import * as _can from './canvas.js';

@Component({
  selector: 'app-canvas-new',
  templateUrl: './canvas-new.component.html',
  styleUrls: ['./canvas-new.component.less']
})
export class CanvasNewComponent implements OnInit {

  canvas: any;
  initCanvas = false;

  currentBoard = {};
  currentBoardProducts = [];
  unsubscribe$: Subject<boolean> = new Subject();

  constructor(
    private boardService: BoardService
  ) { }

  ngOnInit(): void {

    this.initCanvas = true;
    this.canvas = new fb.Canvas('canvas');
    this.canvas.add(new fb.Text('Hello From Canvas!!'));
    console.log($);

    // 

    this.boardService.getBoardStateObs()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(state => {
        this.currentBoard = { ...this.boardService.state.currentBoard };
        this.currentBoardProducts = [...this.boardService.state.currentBoardProducts];
      });
  }

  addProductToBoard(product) {
    console.log("Printing from canvas", product);
    alert("This is printed from canvas, it means canvas component is able to recieve inputs from the board and can do its work when its integrated.");
  }

  handleToolboxActions(action) {
    console.log("Printing from canvas", action);    
    alert("This is printed from canvas, it means canvas component is able to recieve inputs from the board and can do its work when its integrated.");
  }

  handleTextActions(action) {
    console.log("Printing from canvas", action);
    alert("This is printed from canvas, it means canvas component is able to recieve inputs from the board and can do its work when its integrated.");
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

}
