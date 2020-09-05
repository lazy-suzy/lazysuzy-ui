import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { VariationsModule } from '../variations/variations.module';
import { RedirectModule } from '../redirect/redirect.module';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { BrandListComponent } from './brand-list.component';

const DECLARATIONS = [
    BrandListComponent
];

const MODULES = [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    VariationsModule,
    RedirectModule,
    MatSelectModule,
    FormsModule,
    NgxJsonLdModule
];

const COMPONENTS = [BrandListComponent];

@NgModule({
    declarations: [...DECLARATIONS],
    entryComponents: [...COMPONENTS],
    imports: [...MODULES],
    exports: [...DECLARATIONS, ...MODULES]
})
export class BrandListModule { }
