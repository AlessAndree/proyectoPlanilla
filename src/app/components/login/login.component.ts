import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as crypto from 'crypto-js';

import {MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  durationInSeconds = 5;

  hide = true;
  hide2 = true;

  formLogin: FormGroup;
  formRegister: FormGroup;

  constructor(private _authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      pass: new FormControl('', Validators.required  )
    });
    this.formRegister = new FormGroup({
      emailRegister: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      passRegister1: new FormControl('', Validators.required  ),
      passRegister2: new FormControl('', Validators.required  )
    });
  }

  openSnackBar(mensaje: string) {
    this._snackBar.openFromComponent(loginMessageComponent, {
      duration: this.durationInSeconds * 1000, data: mensaje
    });
  }

  ngOnInit(): void {}

  async clickRegister() {

    try {
      const passCrip = crypto.SHA512(this.formRegister.get('passRegister1')?.value).toString();
      const user = await this._authService.register(this.formRegister.get('emailRegister')?.value, passCrip);
      if (user) {
        this.router.navigate(['inicio']);
      }
    } catch (err: any) {
      // console.error('ESTE ES EL ERROR', err);
      if(err.code == 'auth/email-already-in-use') {
        this.openSnackBar('Error, el correo ingresado ya esta registrado.');
      } else if ( err.code == 'auth/weak-password') {
        this.openSnackBar('Error, la contraseña debe tener al menos 6 caracteres.');
      } else {
        this.openSnackBar('Error, no se pudo registrar.');}
    }
  }

  async clickEmailPass() {
    try {
      const passCrip = crypto.SHA512(this.formLogin.get('pass')?.value).toString();
      const user = await this._authService.loginWithEmailPass(this.formLogin.get('email')?.value, passCrip);
      if (user) {
        this.router.navigate(['inicio']);
      }
    } catch (err: any) {
      if(err.code == 'auth/wrong-password') {
        this.openSnackBar('Error, la contraseña es invalida.');
      } else if(err.code == 'auth/user-not-found') {
        this.openSnackBar('Error, usuario no encontrado.');
      } else {
        this.openSnackBar('Error, no se pudo iniciar sesión.');
      }
    }
  }


  async clickGoogle() {
    try {
      const user = await this._authService.loginWithGoogle();
      if (user) {
        // console.log('usuario', user);
        this.router.navigate(['inicio']);
      }
    } catch (err) {console.error(err);}
  }



  logOut() {
    this._authService.logout();
  }

}


@Component({
  selector: 'login-snack-bar-component',
  templateUrl: 'login-snack-bar-component.html',
  styles: [`
    .example-pizza-party {
      color: white;
      text-transform: none;
    }
  `],
})
export class loginMessageComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {
    // // console.log('ESTO ES LO QUE TRAE', data)
  }
}
