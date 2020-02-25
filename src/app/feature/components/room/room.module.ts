import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoomComponent } from './room.component';

const DECLARATIONS = [RoomComponent];

const MODULES = [CommonModule, MatIconModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class RoomModule {}
