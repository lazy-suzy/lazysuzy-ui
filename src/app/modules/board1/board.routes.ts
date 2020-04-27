import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardContainerComponent } from './components/board-container/board-container.component';
import { BoardContainerNewComponent } from './components/board-container-new/board-container-new.component';
import { SelectComponent } from './components/select/select.component';
import { TextComponent } from './components/text/text.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { BrowseComponent } from './components/browse/browse.component';
import { AddComponent } from './components/add/add.component';
import { BoardComponent } from './components/board/board.component';

const routes: Routes = [
  {
    path: '',
    component: BoardContainerNewComponent,
    children: [
      {
        path: '',
        redirectTo: 'board-landing',
        pathMatch: 'full'
      },
      {
        path: 'board-landing',
        component: BoardContainerComponent
      },
      {
        path: 'board-select',
        component: SelectComponent
      },
      {
        path: 'board-text',
        component: TextComponent
      },
      {
        path: 'board-favorites',
        component: FavoritesComponent
      },
      {
        path: 'board-browse',
        component: BrowseComponent
      },
      {
        path: 'board-add',
        component: AddComponent
      },
      {
        path: 'board-board',
        component: BoardComponent
      },
    ]
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
