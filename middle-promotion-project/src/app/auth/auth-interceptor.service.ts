import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(public auth: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return this.auth.user.pipe(
            take(1),
            exhaustMap(user => {

                if (!user?.token) {
                    return next.handle(request);
                }

                const modifiedRequest = request.clone({
                    params: new HttpParams().set('auth', user?.token)
                })

                return next.handle(modifiedRequest);
            })
        );
    }
}
