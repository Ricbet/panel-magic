import { Component, OnInit, Input, OnDestroy } from "@angular/core";

import { MapModel } from "./map-site-view/model";
import { WidgetModel } from "../../model/widget.model";
import { PanelWidgetModel } from "../../model";
import { Subscription } from "rxjs";

@Component({
	selector: "app-map-view",
	templateUrl: "./map-view.component.html",
	styleUrls: ["./map-view.component.scss"]
})
export class MapViewComponent implements OnInit, OnDestroy {
	private profileValueChangeRX$: Subscription;
	private _autoWidget: PanelWidgetModel;
	// 默认的基础配置项
	public widgetModel: WidgetModel;
	@Input()
	public get autoWidget(): PanelWidgetModel {
		return this._autoWidget;
	}
	public set autoWidget(v: PanelWidgetModel) {
		if (v["type"] != "") {
			this._autoWidget = v;
			this.widgetModel = v.autoWidget;
			this.widgetModel.content.mapModel = new MapModel(v.autoWidget.content.mapModel);
			this.openValueChange();
		}
	}

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {
		if (this.profileValueChangeRX$) this.profileValueChangeRX$.unsubscribe();
	}

	/**
	 * 开启监听
	 */
	public openValueChange(): void {
		if (this.autoWidget) {
			this.profileValueChangeRX$ = this.autoWidget.profileModel.valueChange$.subscribe(value => {
				this.autoWidget.profileModel.setSourceDataNoLaunch({
					rotate: 0
				});
			});
		}
	}
}
