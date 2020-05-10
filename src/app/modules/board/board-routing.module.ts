import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { boardRoutesNames } from './board.routes.names';

import { BoardComponent } from './board.component';
import { BoardViewComponent } from './board-view/board-view.component';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardPreviewComponent } from './board-preview/board-preview.component';
import { BoardPopupComponent } from './board-popup/board-popup.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: boardRoutesNames.BOARD_LIST
  },
  {
    path: boardRoutesNames.BOARD_VIEW + "/:uuid",
    component: BoardViewComponent
  },
  {
    path: boardRoutesNames.BOARD_LIST,
    component: BoardListComponent
  },
  {
    path: boardRoutesNames.BOARD_PREVIEW + "/:uuid",
    component: BoardPreviewComponent
  },
  {
    path: boardRoutesNames.BOARD_POPUP,
    component: BoardPopupComponent
  },
  {
    path: boardRoutesNames.BOARD_POPUP + "/:uuid",
    component: BoardPopupComponent
  },
  {
    path: boardRoutesNames.BOARD_EMBED + "/:uuid",
    component: BoardPreviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule { }
