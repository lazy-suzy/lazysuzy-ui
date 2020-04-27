import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { boardRoutesNames } from './board.routes.names';

import { BoardComponent } from './board.component';
import { BoardViewComponent } from './board-view/board-view.component';
import { BoardListComponent } from './board-list/board-list.component';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent
  },
  {
    path: boardRoutesNames.BOARD_VIEW,
    component: BoardViewComponent
  },
  {
    path: boardRoutesNames.BOARD_LIST,
    component: BoardListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule { }
