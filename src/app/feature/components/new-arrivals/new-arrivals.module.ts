import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewArrivalsComponent } from './new-arrivals.component';
import { CarouselModule } from 'primeng/carousel';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NewArrivalsComponent],
  imports: [CommonModule, CarouselModule, RouterModule],
  exports: [NewArrivalsComponent, CarouselModule, CommonModule]
})
export class NewArrivalsModule {}
