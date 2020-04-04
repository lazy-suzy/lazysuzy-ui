import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BestSellersComponent } from './best-sellers.component';
import { CarouselModule } from 'primeng/carousel';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [BestSellersComponent],
  imports: [
    CommonModule, CarouselModule, SharedModule],
  exports: [BestSellersComponent, CommonModule, CommonModule]
})
export class BestSellersModule { }
