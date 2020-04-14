import { Component, OnInit, ViewChild } from '@angular/core';
import { BoardService } from 'src/app/shared/services/board/board.service';
import * as $ from 'jquery';
import { MidPanelComponent } from '../mid-panel/mid-panel.component';
import { CanvasComponent } from '../canvas/canvas.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-board-container',
  templateUrl: './board-container.component.html',
  styleUrls: ['./board-container.component.less']
})
export class BoardContainerComponent implements OnInit {

  showLoader: boolean = false;
  selectedItem = null;

  @ViewChild('midpanel', { static: true }) midpanel?: MidPanelComponent;
  @ViewChild('canvas', { static: false }) canvas?: CanvasComponent;
  @ViewChild('toolbar', { static: false }) toolbar?: ToolbarComponent;

  constructor(public boardService: BoardService) { }

  ngOnInit(): void {
    this.boardService.initBoard('');
  }

  handleMidPanelUpdates(event) {
    if (event.name === 'GO_TO') {
      this.handleBoardSideNavUpdates(event.payload);
    }
  }

  handleBoardSideNavUpdates(event) {
    this.selectedItem = event;
  }

  handleAddProduct(event) {
    this.canvas.addProductToBoard(event);
  }

  handleToolbarActions(event) {
    this.canvas.handleToolboxActions(event);
  }

  handleTextActions(event) {
    this.canvas.handleTextActions(event);
  }

  handleUpdateSelect(event) {
    this.boardService.setCategory(event);
    this.selectedItem = {
      name: 'Browse',
      label: 'Browse',
      value: 'Browse'
    };
  }

}
