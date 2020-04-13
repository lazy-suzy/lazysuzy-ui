import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BoardRoutingModule } from './board.routes';
import { CanvasComponent } from './components/canvas/canvas.component';
import { BoardContainerComponent } from './components/board-container/board-container.component';
import { BoardSideNavComponent } from './components/board-side-nav/board-side-nav.component';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';
import { SelectComponent } from './components/select/select.component';
import { MidPanelComponent } from './components/mid-panel/mid-panel.component';
import { TextComponent } from './components/text/text.component';
import { BrowseComponent } from './components/browse/browse.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { BoardComponent } from './components/board/board.component';
import { AddComponent } from './components/add/add.component';
import { MatSelectModule } from '@angular/material/select'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowsefilterComponent } from './components/browse-filter/browse-filter.component';
import { MaterialModule } from 'src/app/shared/material-module';
import { MultiSelectModule } from 'primeng/multiselect';
import { AddViaUrlComponent } from './components/add-via-url/add-via-url.component';
import { StepperOverviewExample } from './components/add-via-url-stepper/stepper-overview-example';
import { StepOneComponent } from './components/add-via-url-stepper/step-one/step-one.component';
import { StepTwoComponent } from './components/add-via-url-stepper/step-two/step-two.component';
import { TextInputComponent } from './components/add-via-url-stepper/text-input/text-input.component';
import { BoardProductsComponent } from './components/board-products/board-products.component';
import { AppProductPreviewComponent } from './components/product-preview/product-preview.component';
import { FileUploadModule } from 'ng2-file-upload';

const DECLARATIONS = [
  BoardContainerComponent,
  MidPanelComponent,
  BoardSideNavComponent,
  SelectComponent,
  TextComponent,
  BrowseComponent,
  FavoritesComponent,
  BoardComponent,
  CanvasComponent,
  AddComponent,
  ToolbarComponent,
  BrowsefilterComponent,
  AddViaUrlComponent,
  StepperOverviewExample,
  StepOneComponent,
  StepTwoComponent,
  TextInputComponent,
  BoardProductsComponent,
  AppProductPreviewComponent
];

const MODULES = [
  CommonModule,
  BoardRoutingModule,
  LoaderModule,
  MatSelectModule,
  FormsModule,
  ReactiveFormsModule,
  MatSliderModule,
  MatInputModule,
  OverlayPanelModule,
  PanelModule,
  PanelMenuModule,
  MatTabsModule,
  MaterialModule,
  MultiSelectModule,
  FileUploadModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
  entryComponents: [
    AddViaUrlComponent
  ]
})
export class BoardModule { }
