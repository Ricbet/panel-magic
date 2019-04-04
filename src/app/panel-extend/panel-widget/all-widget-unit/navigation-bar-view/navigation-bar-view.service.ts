import { Injectable } from "@angular/core";
import { PanelWidgetModel } from "../../model";
import { NavigationBarModel } from "./navigation-bar-site-view/model";
import { HostItemModel } from "../../model/host.model";

@Injectable({
	providedIn: "root"
})
export class NavigationBarViewService {
	// 当前头部标题拦的数据模型
	public navigationWidgetModel: NavigationBarModel = new NavigationBarModel();

	// 需要传递给组件设置类的panwlwidget类
	public navigationPanelSiteWidget: PanelWidgetModel = new PanelWidgetModel(<HostItemModel>{
		autoWidget: {
			type: "navigationbar",
			content: { navigationModel: new NavigationBarModel() },
			customfeature: {},
			style: {
				data: {},
				children: []
			}
		}
	});

	constructor() {}

	// 设置标题字体颜色
	public setFrontColor(color: string): this {
		this.navigationWidgetModel.frontColor = color;
		return this;
	}

	// 设置标题背景颜色
	public setBgColor(color: string): this {
		this.navigationWidgetModel.bgColor = color;
		return this;
	}

	// 附值标题设置数据模型
	public setNavigationWidgetSiteData(data: NavigationBarModel = this.navigationWidgetModel): this {
		this.navigationPanelSiteWidget.autoWidget.content.navigationModel = data;
		return this;
	}

	// 重置颜色
	public initNavigationWidget(): void {
		this.navigationWidgetModel.reset();
	}
}
