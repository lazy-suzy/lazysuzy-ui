import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CollectionListComponent} from "./collection-list.component";



@NgModule({
  declarations: [
      CollectionListComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CollectionListComponent
  ]
})
export class CollectionListModule { }
