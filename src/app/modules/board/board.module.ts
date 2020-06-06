import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { BoardComponent } from './board.component';
import { BoardViewComponent } from './board-view/board-view.component';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardPreviewComponent } from './board-preview/board-preview.component';
import { BoardPopupComponent } from './board-popup/board-popup.component';
import { BoardPopupConfigComponent } from './board-popup-config/board-popup-config.component';
import { BoardLoaderComponent } from './board-loader/board-loader.component';
import { BoardPopupConfirmComponent } from './board-popup-confirm/board-popup-confirm.component';

import { BoardService } from './board.service';
import { CookieService } from 'ngx-cookie-service';
import { BoardRoutingModule } from './board-routing.module';
import { SelectComponent } from './board-select/select.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BoardAddComponent } from './board-add/add.component';
import { AddViaUrlComponent } from './board-add/add-via-url/add-via-url.component';
// import { StepperOverviewExample } from './board-add/add-via-url-stepper/stepper-overview-example';
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
import { BoardTextComponent } from './components/board-text/board-text.component';
// import { StepOneComponent } from './board-add/add-via-url-stepper/step-one/step-one.component';
// import { StepTwoComponent } from './board-add/add-via-url-stepper/step-two/step-two.component';
import { BoardProductsComponent } from './components/board-products/board-products.component';
import { CurrentBoardComponent } from './components/current-board/board.component';
import { AddFileUploadComponent } from './board-add/add-file-upload/add-file-upload.component';
import { UploadFileDetailsComponent } from './board-add/add-file-upload/upload-file-details/upload-file-details.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import {
  FontPickerModule,
  FONT_PICKER_CONFIG,
  FontPickerConfigInterface
} from 'ngx-font-picker';
import { Ng5SliderModule } from 'ng5-slider';

const DEFAULT_FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  apiKey: 'AIzaSyBCssLRX6vTUWmk__OTRIz5699gL4kgpVQ'
};

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
    CarouselModule,
    FontPickerModule,
    Ng5SliderModule,
    InfiniteScrollModule
  ],
  declarations: [
    BoardComponent,
    BoardViewComponent,
    BoardListComponent,
    BoardPreviewComponent,
    BoardPopupComponent,
    BoardPopupConfigComponent,
    BoardLoaderComponent,
    BoardPopupConfirmComponent,
    SelectComponent,
    BoardAddComponent,
    AddViaUrlComponent,
    // StepperOverviewExample,
    BrowsefilterComponent,
    AppProductPreviewComponent,
    BoardPreviewComponent,
    BoardTextComponent,
    // StepperOverviewExample,
    // StepOneComponent,
    // StepTwoComponent,
    BoardProductsComponent,
    CurrentBoardComponent,
    AddFileUploadComponent,
    UploadFileDetailsComponent
  ],
  entryComponents: [
    AddViaUrlComponent,
    UploadFileDetailsComponent,
    BoardPopupConfigComponent,
    BoardPopupConfirmComponent
  ],
  providers: [
    BoardService,
    CookieService,
    {
      provide: FONT_PICKER_CONFIG,
      useValue: DEFAULT_FONT_PICKER_CONFIG
    }
  ]
})
export class BoardModule {}
