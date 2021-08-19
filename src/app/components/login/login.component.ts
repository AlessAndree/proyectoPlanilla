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

  formLogin: FormGroup

  constructor(private _authService: AuthService, private router: Router) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      pass: new FormControl('', Validators.required  )
    });
  }

  ngOnInit(): void {}

  async clickGoogle() {
    try {
      const user = await this._authService.loginWithGoogle();
      if (user) {
        this.router.navigate(['home']);
      }
    } catch (err) {console.error(err);
    }
  }

  async clickEmailPass() {
    // console.log(this.formLogin);
    // console.log(
    //   this.formLogin.get('email')
    // );
    await this._authService.loginWithEmailPass(this.formLogin.get('email')?.value, this.formLogin.get('pass')?.value)
    .then(data => {
      console.log('RESULTADO BUENO ', data);
      this.router.navigate(['home']);
    }).catch(err=>console.error('RESULTADO MALO', err));
  }

  logOut() {
    this._authService.logout();
  }

}
