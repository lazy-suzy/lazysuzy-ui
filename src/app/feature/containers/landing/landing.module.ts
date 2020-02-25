import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../core/core.module';
import { RoomModule } from './../../components';
import { LandingComponent } from './landing.component';

const DECLARATIONS = [LandingComponent];

const MODULES = [CommonModule, CoreModule, RoomModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class LandingModule {}
