import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from "rxjs";
import { weatherRequestConfig } from "../user-console/articles/article-list/weather/weather.service";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(public auth: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return this.auth.user.pipe(
            take(1),
            exhaustMap(user => {
                if (!user?.token && !this.auth.tempToken) {
                    return next.handle(request);
                }

                if (request.url === weatherRequestConfig.baseUrl) {
                    return next.handle(request);
                }

                const modifiedRequest = request.clone({
                    params: new HttpParams().set('auth', user?.token ? user.token : this.auth.tempToken)
                })

                return next.handle(modifiedRequest);
            })
        );
    }
}
