import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FurnitureCareComponent} from './furniture-care/furniture-care.component';


const routes: Routes = [
    {
        path: '',
        component: FurnitureCareComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FurnitureCareRoutingModule {
}
