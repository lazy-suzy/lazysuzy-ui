import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { BoardComponent } from './board.component';
import { BoardViewComponent } from './board-view/board-view.component';
import { BoardListComponent } from './board-list/board-list.component';

import { BoardService } from './board.service';
import { CookieService } from 'ngx-cookie-service';
import { BoardRoutingModule } from './board-routing.module';
import { BoardSideNavComponent } from './board-side-nav/board-side-nav.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    BoardRoutingModule
  ],
  declarations: [
    BoardComponent,
    BoardViewComponent,
    BoardListComponent,
    BoardSideNavComponent
  ],
  providers: [BoardService, CookieService]
})
export class BoardModule { }
