import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { CookieService } from 'ngx-cookie';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Injectable()
export class AppService {
	public iconUrls: SafeResourceUrl;
	constructor(private readonly cookieService: CookieService, private readonly sanitizer: DomSanitizer) {
		this.resolveIconUrl();
	}

	/**
	 * 处理安全性
	 */
	public safeUrl(url: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	/**
	 * 获取图标链接
	 */
	public resolveIconUrl() {
		this.iconUrls = this.safeUrl(`/assets/iconfont/iconfont.css?v=${environment.statics_version}`);
	}

	/**
	 * 获取本地数据
	 */
	public getItemLocal(key: string): any {
		const getItem = this.cookieService.get(key);
		return {
			token_type: 'Bearer',
			access_token: getItem
		};
	}

	/**
	 * 获取通用请求头
	 */
	public getCommonHeader(auth: boolean = true, contentType: string = 'application/json'): HttpHeaders {
		let headers: HttpHeaders = new HttpHeaders();
		if (contentType) { headers.append('Content-Type', contentType); }
		// token 则打开
		if (auth) {
			const token = `token_type: 'Bearer', access_token: ${this.cookieService.get('access_token')}`;
			headers = headers.append('Authorization', token);
		}
		return headers;
	}
}
