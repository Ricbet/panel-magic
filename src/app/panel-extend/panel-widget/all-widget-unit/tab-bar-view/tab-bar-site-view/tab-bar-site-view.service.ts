import { Injectable } from "@angular/core";

import { TabbarModel } from "./model";

@Injectable()
export class TabBarSiteViewService {
    // 底部导航数据模型
    public tabbarModel: TabbarModel;

    constructor() {}
}
