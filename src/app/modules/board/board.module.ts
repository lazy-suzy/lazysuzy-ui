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
import { SelectComponent } from './board-select/select.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddComponent } from './board-add/add.component';
import { AddViaUrlComponent } from './board-add/add-via-url/add-via-url.component';
import { StepperOverviewExample } from './board-add/add-via-url-stepper/stepper-overview-example';
import { BrowsefilterComponent } from './browse-filter/browse-filter.component';

import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'src/app/shared/material-module';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'ng2-file-upload';
import { MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppProductPreviewComponent } from './product-preview/product-preview.component';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  imports: [
    CommonModule,
    BoardRoutingModule,
    HttpClientModule,
    SharedModule,
    MatSliderModule,
    MatInputModule,
    OverlayPanelModule,
    PanelModule,
    PanelMenuModule,
    MatTabsModule,
    MaterialModule,
    MultiSelectModule,
    FileUploadModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    KeyboardShortcutsModule.forRoot(),
    CarouselModule
  ],
  declarations: [
    BoardComponent,
    BoardViewComponent,
    BoardListComponent,
    BoardPreviewComponent,
    SelectComponent,
    AddComponent,
    AddViaUrlComponent,
    StepperOverviewExample,
    BrowsefilterComponent,
    AppProductPreviewComponent,
    BoardPreviewComponent
  ],
  providers: [BoardService, CookieService]
})
export class BoardModule { }
