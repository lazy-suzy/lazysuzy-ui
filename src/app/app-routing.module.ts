import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', component: LandingComponent, pathMatch: 'full' },
  {
    path: 'products/:category',
    loadChildren: () =>
      import('./feature/containers/products/products.module').then(
        m => m.ProductsModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // initialNavigation: 'enabled',
      // preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
