import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CollectionsDashboardComponent} from './collections-dashboard/collections-dashboard.component';


const routes: Routes = [
    {
        path: '',
        component: CollectionsDashboardComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CollectionsDashboardRoutingModule {
}
