
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardContainerComponent } from './components/board-container/board-container.component';

const routes: Routes = [
  {
    path: '',
    component: BoardContainerComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class BoardRoutingModule { }
