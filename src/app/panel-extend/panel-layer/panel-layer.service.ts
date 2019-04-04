import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { SoulLayerModel } from "./model";
import { PanelWidgetModel } from "../panel-widget/model";

@Injectable({
	providedIn: "root"
})
export class PanelLayerService {
	// widget组件的移入和移除可观察对象
	public launchMouseEnterOut: BehaviorSubject<{
		widget: PanelWidgetModel;
		type: "enter" | "out";
	}> = new BehaviorSubject(null);

	// 图层和组件库数据模型
	public soulLayerModel: SoulLayerModel = new SoulLayerModel();

	constructor() {}
}
