import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { VarifyEmailComponent } from './auth/varify-email/varify-email.component';
import { HomeComponent } from './components/home/home.component';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ProductComponent } from './components/home/product/product.component';
import { OrderDetailsComponent } from './components/view-orders/order-details/order-details.component';
import { ViewOrdersComponent } from './components/view-orders/view-orders.component';

const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch:'full'},
  {path: 'login', component : LoginComponent},
  {path: 'dashboard', component : HomeComponent},
  {path: 'register', component : RegisterComponent},
  {path: 'varify-email', component : VarifyEmailComponent},
  {path: 'forgot-password', component : ForgotPasswordComponent},
  {path: 'product', component : ProductComponent},
  {path: 'orders', component : ViewOrdersComponent},
  // {path: 'cart', component : ViewCartComponent},
  {path: 'order-details', component : OrderDetailsComponent},
  // {path: 'user-form', component : UserFormComponent},
  {path: 'add-product', component : AddComponent},
  {path: 'edit-product', component : EditComponent},
  // {path: 'front-page', component : FrontPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
