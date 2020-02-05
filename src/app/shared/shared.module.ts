import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

const DECLARATIONS = [];

const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class SharedModule {}
