import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { environment } from "environments/environment";

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
        this.iconUrls = this.safeUrl(`assets/iconfont/iconfont.css?v=${environment.statics_version}`);
    }
}
