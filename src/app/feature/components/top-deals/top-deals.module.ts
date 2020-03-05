import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopDealsComponent } from './top-deals.component';
import { CarouselModule } from 'primeng/carousel';


@NgModule({
  declarations: [TopDealsComponent],
  imports: [
    CommonModule, CarouselModule
  ],
  exports: [TopDealsComponent, CommonModule, CarouselModule]
})
export class TopDealsModule { }
