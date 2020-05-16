import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private storage: Storage,
    private router: Router
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!(await this.storage.get('id'))) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    } else {
      return true;
    }
  }
}
