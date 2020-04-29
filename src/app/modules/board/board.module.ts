import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { BoardComponent } from './board.component';
import { BoardViewComponent } from './board-view/board-view.component';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardPreviewComponent } from './board-preview/board-preview.component';

import { BoardService } from './board.service';
import { CookieService } from 'ngx-cookie-service';
import { BoardRoutingModule } from './board-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BoardRoutingModule,
    HttpClientModule
  ],
  declarations: [
    BoardComponent,
    BoardViewComponent,
    BoardListComponent,
    BoardPreviewComponent
  ],
  providers: [BoardService, CookieService]
})
export class BoardModule { }
