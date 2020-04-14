import { Component, OnInit } from '@angular/core';
import * as fb from './fb.min.js';
import { BoardService } from 'src/app/shared/services/board/board.service.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less']
})
export class CanvasComponent implements OnInit {

  currentBoard = {};
  currentBoardProducts = [];
  unsubscribe$: Subject<boolean> = new Subject();

  constructor(
    private boardService: BoardService
  ) { }

  ngOnInit(): void {
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
