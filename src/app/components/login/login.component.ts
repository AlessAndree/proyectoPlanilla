import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;
  hide2 = true;

  formLogin: FormGroup;
  formRegister: FormGroup;

  constructor(private _authService: AuthService, private router: Router) {
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

  ngOnInit(): void {}

  async clickRegister() {

    try {

      const user = await this._authService.register(this.formRegister.get('emailRegister')?.value, this.formRegister.get('passRegister1')?.value);
      if (user) {
        this.router.navigate(['inicio']);
      }

    } catch (err) {console.error(err);}

  }


  async clickGoogle() {
    try {
      const user = await this._authService.loginWithGoogle();
      if (user) {
        this.router.navigate(['inicio']);
      }
    } catch (err) {console.error(err);}
  }

  async clickEmailPass() {
    try {
      const user = await this._authService.loginWithEmailPass(this.formLogin.get('email')?.value, this.formLogin.get('pass')?.value);
      if (user) {
        this.router.navigate(['inicio']);
      }
    } catch (err) {console.error(err);}
  }

  logOut() {
    this._authService.logout();
  }

}
