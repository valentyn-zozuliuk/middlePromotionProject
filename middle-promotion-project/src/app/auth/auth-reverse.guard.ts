import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { ProviderId, UserProfile } from "@firebase/auth";
import { exhaustMap, map, Observable, of, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthReverseGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) {

    }

    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot
        ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
            return this.auth.user.pipe(
                take(1),
                map((user) => {
                    const isNotAuth = !user;

                    return isNotAuth ? isNotAuth : this.router.createUrlTree(['/user-console']);
                })
            );
    }
}
