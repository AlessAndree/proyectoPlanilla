import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PruebaComponent } from './components/prueba/prueba.component';

const routes: Routes = [
  {path: '', component: NavbarComponent, children: [
    {path: 'home', component:PruebaComponent}
  ]},
  {path: 'login', component: LoginComponent},
  // {path: 'home', },
  // {path: 'prueba', component: PruebaComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
