import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { OwlModule } from 'ngx-owl-carousel';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';

const DECLARATIONS = [BannerComponent];

const MODULES = [CommonModule, OwlModule, RouterModule, CarouselModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class BannerModule { }
