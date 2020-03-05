import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseByRoomComponent } from './browse-by-room.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [BrowseByRoomComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [BrowseByRoomComponent]
})
export class BrowseByRoomModule { }
