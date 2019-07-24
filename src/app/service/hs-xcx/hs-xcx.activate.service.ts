import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MockModel } from "./MockModel";

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { NzNotificationService } from "ng-zorro-antd";

import { AppDataService } from "../../appdata/appdata.service";

@Injectable()
export class HsXcxCanActivate implements CanActivate {
    constructor(
        private readonly nzNotificationService: NzNotificationService,
        private readonly appDataService: AppDataService
    ) {}

    // 页面内容详情守卫
    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const appId = route.params.id;
        this.appDataService.appDataModel.app_id = appId;
        if (appId == undefined) {
            this.nzNotificationService.create("error", "请求错误", "请输入正确的appID");
            return false;
        } else {
            setTimeout(() => {
                this.appDataService.setAppData(MockModel as any);
            }, 2000);
            return true;
        }
    }
}
