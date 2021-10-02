import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/providers/auth.service';
import { ObsService } from 'src/app/providers/obs.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  urlPhoto: string = '../../../assets/style/4.png';

  user: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private auth: AuthService, private obsService: ObsService) {
    this.getUser();
  }

  logOut() {
    this.obsService.ejecutarObservableUid(null);
    this.auth.logout();
  }

  async getUser() {
    this.user = await this.auth.getUser();
    if (this.user) {
      await this.obsService.ejecutarObservableUid(this.user.uid);
    }
  }

}
