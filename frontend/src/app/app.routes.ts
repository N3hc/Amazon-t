import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home-page/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProductsComponent } from './features/products/product-list-page/products.component';
import { DetailComponent } from './features/products/product-detail-page/detail.component';
import { CartComponent } from './features/cart/cart-page/cart.component';
import { PromoThingsComponent } from './features/home/components/promo-things/promo-things.component';
import { PaymentComponent } from './features/cart/payment-page/payment.component';
import { UserComponent } from './features/user/user-page/user.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', component: PromoThingsComponent },
      { path: 'products', component: ProductsComponent }
    ]
  },
  { path: 'user', component: UserComponent, },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products/details/:id', component: DetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'cart/payment', component: PaymentComponent },
  { path: '**', redirectTo: 'home' }
];
