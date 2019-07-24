import { Injectable, Injector } from "@angular/core";

/**
 * app 初始化前身份验证操作
 */
@Injectable({
    providedIn: "root",
})
export class AppInitAuthService {
    constructor() {}

    /** 验证当前token身份 */
    tokenAuth(): Promise<any> {
        return new Promise(resolve => {
            resolve(true);
        });
    }
}
