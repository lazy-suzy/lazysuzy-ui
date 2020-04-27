import { Component, OnInit, ViewChild } from '@angular/core';
import { MidPanelComponent } from '../mid-panel/mid-panel.component';
import { CanvasComponent } from '../canvas/canvas.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { BoardService } from 'src/app/shared/services/board/board.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-container-new',
  templateUrl: './board-container-new.component.html',
  styleUrls: ['./board-container-new.component.less']
})
export class BoardContainerNewComponent implements OnInit {

  showLoader: boolean = false;
  selectedItem = null;

  @ViewChild('midpanel', { static: true }) midpanel?: MidPanelComponent;
  @ViewChild('canvas', { static: false }) canvas?: CanvasComponent;
  @ViewChild('toolbar', { static: false }) toolbar?: ToolbarComponent;

  constructor(
    public boardService: BoardService,
    private router: Router
  ) { }

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
    debugger;
    this.router.navigate([`/board/${event.route}`]);
    if (event.value == 'Select') {
      this.boardService.state.selectedCategory = null;
    }
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
