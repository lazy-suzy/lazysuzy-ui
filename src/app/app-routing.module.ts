import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
    AllProductsComponent,
    CartComponent,
    CategoriesComponent,
    ForgotPasswordComponent,
    LandingComponent,
    ProductsComponent,
    ResetPasswordComponent,
    SearchComponent,
    WishlistComponent
} from './feature/containers';
import {AboutusComponent, PrivacyPolicyComponent, TermsOfServiceComponent} from './core/components';
import {
    EditMyProfileComponent,
    OrderSuccessComponent,
    PaymentComponent,
    ProductDetailsMobileComponent,
    PublicProfileComponent
} from './feature/components';
import {environment} from 'src/environments/environment';
import {ProductCollectionsComponent} from './feature/containers/product-collections/product-collections.component';

const routes: Routes = [
    {path: '', component: LandingComponent, pathMatch: 'full'},

    {
        path: environment.BOARD_BASE_HREF,
        loadChildren: () =>
            import('./modules/board/board.module').then((m) => m.BoardModule)
        // pathMatch: 'full'
    },

    {path: 'search', component: SearchComponent},
    {path: 'aboutus', component: AboutusComponent},
    {path: 'termsofservice', component: TermsOfServiceComponent},
    {path: 'privacypolicy', component: PrivacyPolicyComponent},
    {path: 'cart', component: CartComponent},
    // { path: 'billing', component: BillingComponent },
    {path: 'checkout', component: PaymentComponent},
    {path: 'order/:order', component: OrderSuccessComponent},
    {path: 'wishlist', component: WishlistComponent, pathMatch: 'full'},
    {
        path: 'products/all',
        component: AllProductsComponent,
        pathMatch: 'full'
    },
    {
        path: 'products/brand',
        component: AllProductsComponent,
        pathMatch: 'full'
    },
    {
        path: 'products/collections',
        component: ProductCollectionsComponent,
        pathMatch: 'full'
    },
    {
        path: 'products/:department',
        component: CategoriesComponent,
        pathMatch: 'full'
    },
    {
        path: 'products/:department/:category',
        component: ProductsComponent,
        pathMatch: 'full'
    },
    {
        path: 'product/:product',
        component: ProductDetailsMobileComponent,
        pathMatch: 'full'
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        pathMatch: 'full'
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
        pathMatch: 'full'
    },
    {
        path: 'blog',
        loadChildren: () => import('./feature/blog/blog/blog.module').then(m => m.BlogModule)
    },
    {
        path: 'faq-order',
        loadChildren: () => import('./feature/faq/faq.module').then(m => m.FaqModule)
    },
    {
        path: 'admin/dashboard/new-products',
        loadChildren: () =>
            import('./modules/new-products-dashboard/new-products-dashboard.module').then(
                (m) => m.NewProductsDashboardModule
            )
    },
    {
        path: 'admin-dashboard',
        loadChildren: () =>
            import('./modules/admin-dashboard/admin-dashboard.module').then(
                (m) => m.AdminDashboardModule
            )
    },
    {path: 'settings/profile', component: EditMyProfileComponent},
    {path: 'p/:profile', component: PublicProfileComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}