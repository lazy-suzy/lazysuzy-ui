import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
    AllProductsModule,
    CartModule,
    CategoriesModule,
    ForgotPasswordModule,
    LandingModule,
    ProductsModule,
    ResetPasswordModule,
    SearchModule,
    WishlistModule
} from './containers';
import {
    EditMyProfileModule,
    OrderSuccessModule,
    PaymentModule,
    ProductDetailsMobileModule,
    PublicProfileModule,
	ReviewFormModule
} from './components';
import {ResetPasswordComponent} from './containers/reset-password/reset-password.component';
import {BrandListModule} from './components/brand-list/brand-list.module';
import {BlogModule} from './blog/blog/blog.module';
import {ProductCollectionsComponent} from './containers/product-collections/product-collections.component';
import {CollectionListModule} from './components/collection-list/collection-list.module';
import {OfferDailogComponent} from './components/offer-dailog/offer-dailog.component';
import {NewsletterPopupComponent} from './components/newsletter-popup/newsletter-popup.component';

const DECLARATIONS = [
    ResetPasswordComponent,
    ProductCollectionsComponent,
    OfferDailogComponent
];
const MODULES = [
    CommonModule,
    ProductsModule,
    LandingModule,
    SearchModule,
    WishlistModule,
    AllProductsModule,
    CategoriesModule,
    ProductDetailsMobileModule,
    CartModule,
    PaymentModule,
    OrderSuccessModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    EditMyProfileModule,
    BrandListModule,
    PublicProfileModule,
    BlogModule,
    CollectionListModule,
	ReviewFormModule
];

@NgModule({
    declarations: [...DECLARATIONS, NewsletterPopupComponent],
    imports: [...MODULES],
    // providers: [AmericanNumberPipe],
    exports: [...DECLARATIONS, ...MODULES],
    entryComponents: [OfferDailogComponent, NewsletterPopupComponent]
})
export class FeatureModule {
}
