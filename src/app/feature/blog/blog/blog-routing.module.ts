import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './components/blog/blog.component';
import { PagePostComponent } from './components/page-post/page-post.component';
import { BlogContainerComponent } from './components/blog-container/blog-container.component';

const routes: Routes = [
  {
    path: '',
    component: BlogContainerComponent,
    children: [
      {
        path: '',
        component: BlogComponent,
      },
      {
        path: ':id',
        component: PagePostComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
