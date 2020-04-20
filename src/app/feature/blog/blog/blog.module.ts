import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [BlogComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [BlogComponent]
})
export class BlogModule { }
