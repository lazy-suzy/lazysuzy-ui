import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../core/core.module';
import { RoomModule, BrowseByRoomModule, TopDealsModule, CreateYourStyleModule } from './../../components';
import { LandingComponent } from './landing.component';
import { OwlModule } from 'ngx-owl-carousel';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule, ReactiveFormsModule} from  '@angular/forms';
import { NewArrivalsModule } from './../../components';
import { BestSellersModule } from '../../components/best-sellers/best-sellers.module';
import { EmailSubscriptionModule } from '../../components/email-subscription/email-subscription.module';
import { SubscribeModule } from '../../components/subscribe/subscribe.module';


const DECLARATIONS = [LandingComponent];

const MODULES = [CommonModule, CoreModule, RoomModule, OwlModule, BrowseByRoomModule, NewArrivalsModule,
  FormsModule ,TopDealsModule,CreateYourStyleModule, EmailSubscriptionModule, BestSellersModule, ReactiveFormsModule, SubscribeModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES,CarouselModule],
  exports: [...DECLARATIONS, ...MODULES],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LandingModule {}
