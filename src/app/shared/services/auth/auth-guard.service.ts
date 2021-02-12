import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(public router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.isGuest()) {
            this.router.navigate(['order-details', 'authenticate']);
            return false;
        }
        this.router.navigate(['order-details', 'view']);
        return true;
    }

    isGuest() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user.user_type === 0;
    }
}
