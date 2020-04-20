import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './components/blog/blog.component';
import { PagePostComponent } from './components/page-post/page-post.component';
import { BlogContainerComponent } from './components/blog-container/blog-container.component';

@NgModule({
  declarations: [
    BlogComponent,
    PagePostComponent,
    BlogContainerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    BlogRoutingModule
  ],
  exports: [BlogComponent]
})
export class BlogModule { }
