import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoomComponent } from './room.component';
import { OwlModule } from 'ngx-owl-carousel';

const DECLARATIONS = [RoomComponent];

const MODULES = [CommonModule, MatIconModule, OwlModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class RoomModule {}
