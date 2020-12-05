import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../../core/core.module';
import {
    RoomModule,
    BrowseByRoomModule,
    TopDealsModule,
    CreateYourStyleModule
} from '../../components';
import {LandingComponent} from './landing.component';
import {CarouselModule} from 'primeng/carousel';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NewArrivalsModule} from '../../components';
import {BestSellersModule} from '../../components';
import {EmailSubscriptionModule} from '../../components/email-subscription/email-subscription.module';
import {SubscribeModule} from '../../components/subscribe/subscribe.module';
import {FlashSaleComponent} from './flash-sale/flash-sale-desktop/flash-sale/flash-sale.component';
import {FlashSaleProductComponent} from './flash-sale/flash-sale-desktop/flash-sale-product/flash-sale-product.component';
import {FlashSaleMobileComponent} from './flash-sale/flash-sale-mobile/flash-sale-mobile/flash-sale-mobile.component';
import {FlashSaleMobileProductComponent} from './flash-sale/flash-sale-mobile/flash-sale-mobile-product/flash-sale-mobile-product.component';
import {FlashSaleMobileProductHorizontalComponent} from './flash-sale/flash-sale-mobile/flash-sale-mobile-product-horizontal/flash-sale-mobile-product-horizontal.component';
import { FeaturedBrandsComponent } from './featured-brands/featured-brands.component';

const DECLARATIONS = [LandingComponent];

const MODULES = [
    CommonModule,
    CoreModule,
    RoomModule,
    BrowseByRoomModule,
    NewArrivalsModule,
    FormsModule,
    TopDealsModule,
    CreateYourStyleModule,
    EmailSubscriptionModule,
    BestSellersModule,
    ReactiveFormsModule,
    SubscribeModule
];

@NgModule({
    declarations: [
        ...DECLARATIONS,
        FlashSaleComponent,
        FlashSaleProductComponent,
        FlashSaleMobileComponent,
        FlashSaleMobileProductComponent,
        FlashSaleMobileProductHorizontalComponent,
        FeaturedBrandsComponent
    ],
    imports: [...MODULES, CarouselModule],
    exports: [...DECLARATIONS, ...MODULES],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingModule {
}
