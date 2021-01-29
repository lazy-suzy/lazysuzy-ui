import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ProductDetailsComponent} from './../product-details/product-details.component';
import {ConfirmCartProductComponent} from '../confirm-cart-product/confirm-cart-product.component';
import {ProductComponent} from './product.component';
import {MatButtonModule} from '@angular/material/button';
import {VariationsModule} from '../variations/variations.module';
import {RedirectModule} from '../redirect/redirect.module';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {NgxJsonLdModule} from '@ngx-lite/json-ld';
import {CarouselModule} from 'primeng/carousel';
import {ReviewFormComponent} from './../reviewForm/reviewForm.component';
import {ReviewDesktopComponent} from '../review-desktop/review-desktop.component';
import {LightboxModule} from '@ngx-gallery/lightbox';
import {AllReviewsDesktopComponent} from '../all-reviews-desktop/all-reviews-desktop.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

const DECLARATIONS = [
    ProductComponent,
    ProductDetailsComponent,
    ReviewFormComponent,
    ConfirmCartProductComponent,
    ReviewDesktopComponent,
    AllReviewsDesktopComponent,
];

const MODULES = [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    VariationsModule,
    RedirectModule,
    MatSelectModule,
    FormsModule,
    NgxJsonLdModule
];

const COMPONENTS = [
    ProductDetailsComponent,
    ConfirmCartProductComponent,
    ReviewFormComponent,
    ReviewDesktopComponent,
    AllReviewsDesktopComponent
];

@NgModule({
    declarations: [...DECLARATIONS],
    entryComponents: [...COMPONENTS],
    imports: [...MODULES, CarouselModule, LightboxModule, InfiniteScrollModule],
    exports: [...DECLARATIONS, ...MODULES]
})
export class ProductModule {
}
