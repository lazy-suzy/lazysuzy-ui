import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BoardRoutingModule } from './board.routes';
import { CanvasComponent } from './components/canvas/canvas.component';
import { BoardContainerComponent } from './components/board-container/board-container.component';
import { BoardSideNavComponent } from './components/board-side-nav/board-side-nav.component';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';

const DECLARATIONS = [CanvasComponent, BoardContainerComponent, BoardSideNavComponent];

const MODULES = [CommonModule, BoardRoutingModule, LoaderModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class BoardModule { }
