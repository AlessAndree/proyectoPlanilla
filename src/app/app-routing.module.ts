import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PruebaComponent } from './components/prueba/prueba.component';

import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['inicio']);

const routes: Routes = [
  {path: '', component: NavbarComponent, children: [
    {path: 'inicio', component:PruebaComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }},
    {path: '', pathMatch: 'full', redirectTo: 'inicio'}

  ]},
  {path: 'login', component: LoginComponent,
  canActivate: [AngularFireAuthGuard],
  data: { authGuardPipe: redirectLoggedInToHome }},
  // {path: 'inicio', },
  // {path: 'prueba', component: PruebaComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
