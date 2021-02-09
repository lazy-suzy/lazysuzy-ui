import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OrderDetailsLoginComponent} from './order-details-login/order-details-login.component';
import {AuthGuardService} from '../../../shared/services/auth/auth-guard.service';
import {OrderDetailsViewComponent} from './order-details-view/order-details-view.component';

const routes: Routes = [

    {
        path: 'view',
        component: OrderDetailsViewComponent,
    },
    {
        path: 'authenticate',
        component: OrderDetailsLoginComponent
    },
    {
        path: '',
        canActivate: [AuthGuardService],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderDetailsRoutingModule {
}
