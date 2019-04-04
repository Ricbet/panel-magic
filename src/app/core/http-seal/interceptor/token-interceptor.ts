import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie";

//拦截器 - 添加请求头
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(private readonly cookieService: CookieService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let token = this.cookieService.get("access_token");
		if (token) {
			token = `Bearer ${token}`;
			req = req.clone({
				setHeaders: {
					Authorization: token
				}
			});
		}
		return next.handle(req);
	}
}
