import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  async clickGoogle() {
    // this.router.navigate(['prueba']);
    try {
      const user = await this._authService.loginWithGoogle();
      if (user) {
        this.router.navigate(['home']);
      }
    } catch (err) {console.error(err);
    }
    // this._authService.loginWithGoogle().then(()=> {
    // }).catch((error:any) => {
    //   console.error(error);
    // })
  }

  logOut() {
    this._authService.logout();
  }

}
