import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BestSellersComponent } from './best-sellers.component';
import { CarouselModule } from 'primeng/carousel';



@NgModule({
  declarations: [BestSellersComponent],
  imports: [
    CommonModule, CarouselModule],
  exports: [BestSellersComponent, CommonModule, CommonModule]
})
export class BestSellersModule { }
