import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FurnitureCareRoutingModule } from './furniture-care-routing.module';
import { FurnitureCareComponent } from './furniture-care/furniture-care.component';


@NgModule({
  declarations: [FurnitureCareComponent],
  imports: [
    CommonModule,
    FurnitureCareRoutingModule
  ]
})
export class FurnitureCareModule { }
