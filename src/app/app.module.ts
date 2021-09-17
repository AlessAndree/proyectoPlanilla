import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './components/login/login.component';

import { environment } from 'src/environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './providers/auth.service';
import { AuthGuardService } from './providers/auth-guard.service';
import { PruebaComponent } from './components/prueba/prueba.component';

import {NgParticlesModule} from "ng-particles";
import { PuestosComponent, DialogPuestosComponent } from './components/puestos/puestos.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    PruebaComponent,
    PuestosComponent,
    DialogPuestosComponent,
    MessageDialogComponent
  ],
  entryComponents: [
    PuestosComponent,
    DialogPuestosComponent,
    MessageDialogComponent
  ],
  imports: [
    BrowserModule,
    NgParticlesModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, AuthGuardService, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
