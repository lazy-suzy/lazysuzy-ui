import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopDealsComponent } from './top-deals.component';
import { CarouselModule } from 'primeng/carousel';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [TopDealsComponent],
  imports: [
    CommonModule, CarouselModule, SharedModule
  ],
  exports: [TopDealsComponent, CommonModule, CarouselModule]
})
export class TopDealsModule { }
