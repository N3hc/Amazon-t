import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' }, 
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: 'home' }
  ];
  