import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductsCarousalComponent } from './components/products-carousal/products-carousal.component';
import { OwlModule } from 'ngx-owl-carousel';
import { LoaderModule } from './components/loader/loader.module';
import { MaterialModule } from './material-module';
// import { AmericanNumberPipe } from './pipes/american-number.pipe';

const DECLARATIONS = [ProductsCarousalComponent];

const MODULES = [CommonModule, OwlModule, LoaderModule, MaterialModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class SharedModule {}
