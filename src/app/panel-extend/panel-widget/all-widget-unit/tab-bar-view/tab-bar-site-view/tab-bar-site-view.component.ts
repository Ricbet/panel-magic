import { Component, OnInit, Input } from "@angular/core";

import { TabBarSiteViewService } from "./tab-bar-site-view.service";
import { WidgetModel } from "../../../model/widget.model";

@Component({
	selector: "app-tab-bar-site-view",
	templateUrl: "./tab-bar-site-view.component.html",
	styleUrls: ["./tab-bar-site-view.component.scss"]
})
export class TabBarSiteViewComponent implements OnInit {
	private _autoWidget: WidgetModel = new WidgetModel();

	@Input()
	public get autoWidget(): WidgetModel {
		return this._autoWidget;
	}
	public set autoWidget(v: WidgetModel) {
		this._autoWidget = v;
	}

	constructor(public tbsvs: TabBarSiteViewService) {}

	ngOnInit() {}
}
