import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner.component';
import { OwlModule } from 'ngx-owl-carousel';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { SharedModule } from 'src/app/shared/shared.module';
import {NavDesktopModule} from '..';

const DECLARATIONS = [BannerComponent];

const MODULES = [
  CommonModule,
  OwlModule,
  RouterModule,
  CarouselModule,
  SharedModule
];

@NgModule({
  declarations: [...DECLARATIONS],
    imports: [...MODULES, NavDesktopModule],
  exports: [...DECLARATIONS, ...MODULES]
})
export class BannerModule {}
