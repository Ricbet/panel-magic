import { Component, OnInit, Input } from "@angular/core";
import { WidgetModel } from "app/panel-extend/panel-widget/model/widget.model";
import { AppDataService } from "app/appdata/appdata.service";

@Component({
	selector: "app-navigation-bar-site-view",
	templateUrl: "./navigation-bar-site-view.component.html",
	styleUrls: ["./navigation-bar-site-view.component.scss"]
})
export class NavigationBarSiteViewComponent implements OnInit {
	private _autoWidget: WidgetModel = new WidgetModel();

	@Input()
	public get autoWidget(): WidgetModel {
		return this._autoWidget;
	}
	public set autoWidget(v: WidgetModel) {
		this._autoWidget = v;
	}

	constructor(private readonly appDataService: AppDataService) {}

	ngOnInit() {}

	/**
	 * 接收字体颜色的变化
	 */
	public acceptFrontColorChange(value: string): void {
		this.appDataService.currentAppDataForinPageData.setCustomfeatureData("navFrontColor", value);
	}

	/**
	 * 接收标题背景色的变化
	 */
	public acceptBgColorChange(value: string): void {
		this.appDataService.currentAppDataForinPageData.setCustomfeatureData("navBgColor", value);
	}
}
