import { Routes } from '@angular/router';
import { LoginComponent } from './components/users/login/login.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryComponent } from './components/categories/category/category.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductComponent } from './components/products/product/product.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { UnauthLayoutComponent } from './layouts/unauth-layout/unauth-layout.component';
import { RegisterComponent } from './components/users/register/register.component';
import { AuthGuard } from './helpers';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
},
   {
    path: '',
    component: MainLayoutComponent, 
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: DashboardComponent,
      },
      {
        path: 'category/all',
        canActivate: [AuthGuard],
        component: CategoryListComponent,
      },
      {
        path: 'category/new',
        canActivate: [AuthGuard],
        component: CategoryComponent,
      },
      {
        path: 'category/:id',
        canActivate: [AuthGuard],
        component: CategoryComponent,
      },
      {
        path: 'product/all',
        canActivate: [AuthGuard],
        component: ProductListComponent,
      },
      {
        path: 'product/new',
        canActivate: [AuthGuard],
        component: ProductComponent,
      },
      {
        path: 'product/:id',
        canActivate: [AuthGuard],
        component: ProductComponent,
      },
    ],
  },{
   path: '',
   component: UnauthLayoutComponent,
   children: [
     {
       path: 'login',
       component: LoginComponent,
     },
     {
       path: 'register',
       component: RegisterComponent,
     },
   ],
 }
];
