import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { timeout, delay, retryWhen, scan, tap } from "rxjs/operators";
import { NzNotificationService } from "ng-zorro-antd";

/** 超时时间 */
const DEFAULTTIMEOUT = 8000;
/** 最大重试次数 */
const MAXRETRYCOUNT = 3;

//拦截器 - 超时以及重试设置
@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
	constructor() {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			timeout(DEFAULTTIMEOUT),
			retryWhen(err$ => {
				//重试 节奏控制器
				return err$.pipe(
					scan((errCount, err) => {
						if (errCount >= MAXRETRYCOUNT) {
							throw err;
						}
						return errCount + 1;
					}, 0),
					delay(800),
					tap(errCount => {
						//副作用
						if (errCount == 1) {
							//第一次重试时显示友好信息
							// this.nzNotificationService.info('网络超时','正在重新请求中...')
						}
					})
				);
			})
			// catchError((err: HttpErrorResponse) => {
			//     this.nzNotificationService.error('网络超时','请重试')
			//     return throwError(err)
			// })
		);
	}
}
