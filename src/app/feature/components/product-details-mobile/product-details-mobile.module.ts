import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MarkdownModule} from 'ngx-markdown';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ProductDetailsMobileComponent} from './product-details-mobile.component';
import {VariationsModule} from '../variations/variations.module';
import {RedirectModule} from '../redirect/redirect.module';
import {FormsModule} from '@angular/forms';
import {NgxJsonLdModule} from '@ngx-lite/json-ld';
import {CarouselModule} from 'primeng/carousel';
import {OwlModule} from 'ngx-owl-carousel';
import {GalleryModule} from '@ngx-gallery/core';
import { ReviewMobileComponent } from './review-mobile/review-mobile.component';
import {LightboxModule} from '@ngx-gallery/lightbox';
import { AllReviewsMobileComponent } from './all-reviews-mobile/all-reviews-mobile.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

const DECLARATIONS = [ProductDetailsMobileComponent];

const MODULES = [
    CommonModule,
    MarkdownModule,
    MatIconModule,
    MatButtonModule,
    VariationsModule,
    RedirectModule,
    FormsModule,
    NgxJsonLdModule,
    CarouselModule,
    OwlModule,

];

@NgModule({
    declarations: [...DECLARATIONS, ReviewMobileComponent, AllReviewsMobileComponent],
    imports: [...MODULES, GalleryModule, LightboxModule, InfiniteScrollModule],
    exports: [...DECLARATIONS, ...MODULES]
})
export class ProductDetailsMobileModule {
}
