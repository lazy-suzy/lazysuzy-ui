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

    //Sample Http Call
    this.showLoader = true;
    this.boardService.getSomeDataSample().subscribe(s => {
      this.showLoader = false;
    });
  }

  handleMidPanelUpdates(event) {
  }

  handleBoardSideNavUpdates(event) {
    this.selectedItem = event;
  }

  handleAddProduct(event) {
    this.canvas.addProductToBoard(event);
  }

  handleToolbarActions(event) {
    debugger;
    this.canvas.handleToolboxActions(event);
  }

}
