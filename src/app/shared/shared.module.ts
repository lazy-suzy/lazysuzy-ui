import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductsCarousalComponent } from './components/products-carousal/products-carousal.component';
import { OwlModule } from 'ngx-owl-carousel';

const DECLARATIONS = [ProductsCarousalComponent];

const MODULES = [CommonModule, OwlModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class SharedModule {}
