import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ProductsComponent } from './pages/items/products/products.component';
import { DetailComponent } from './pages/items/detail/detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { PromoThingsComponent } from './sub-components/promo-things/promo-things.component';
import { PaymentComponent } from './pages/cart/payment/payment.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' }, 
    { 
      path: 'home', 
      component: HomeComponent,
      children: [
          { path: '', component: PromoThingsComponent}, 
          { path: 'products', component: ProductsComponent }
      ]
  },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'products/details/:id', component: DetailComponent },
    { path: 'cart', component: CartComponent },
    { path: 'cart/payment', component: PaymentComponent},
    { path: '**', redirectTo: 'home' }
  ];
  