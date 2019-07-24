import { Injectable } from "@angular/core";
import { PanelWidgetModel } from "../../model";
import { BehaviorSubject } from "rxjs";
import { TabbarModel } from "./tab-bar-site-view/model";
import { HostItemModel } from "../../model/host.model";

@Injectable({
    providedIn: "root",
})
export class TabBarViewService {
    /**
     * 底部导航的数据模型
     */
    public tabbarWidgetModel: PanelWidgetModel = null;

    /**
     * 是否显示底部导航组件
     */
    public isShowTabbar$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() {}

    /**
     * 初始化底部导航
     */
    public initTabbarWidgetData(): PanelWidgetModel {
        return new PanelWidgetModel(<HostItemModel>{
            autoWidget: {
                type: "tabbar",
                content: { tabbarModel: new TabbarModel() },
                customfeature: {},
                style: {
                    data: {
                        "background-color": "#fff",
                        height: "50px",
                        "font-size": "12px",
                    },
                    children: [],
                },
            },
        });
    }

    /**
     * 赋值底部导航数据
     */
    public setTabbarWidgetData(data: TabbarModel): void {
        this.tabbarWidgetModel = this.initTabbarWidgetData();
        this.tabbarWidgetModel.autoWidget.content.tabbarModel = new TabbarModel(data);
    }
}
