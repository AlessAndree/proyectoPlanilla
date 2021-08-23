import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  urlPhoto: string = '../../../assets/style/3.png';

  user: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private auth:AuthService) {
    // this.user = this.auth.user;
    this.getUser();
    console.log('ESTE ES EL USUARIO', this.user);
  }

  logOut() {
    this.auth.logout();
  }

  async getUser() {
    this.user = await this.auth.getUser();
    console.log('ESTE ES EL CURRENT', this.user);
  }

}
