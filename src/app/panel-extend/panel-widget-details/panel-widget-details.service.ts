import { Injectable } from "@angular/core";
import { DetailsModel } from "./model";
import { Subject } from "rxjs";
import { PanelWidgetModel } from "../panel-widget/model";

@Injectable({
	providedIn: "root"
})
export class PanelWidgetDetailsSiteService {
	// 根据传递的type来动态创建对应的设置组件并显示出来
	public launchTypeDetailsView$: Subject<{ type: string; widget: PanelWidgetModel; title?: string }> = new Subject();

	// 组件设置视图数据模型
	public detailsModel: DetailsModel = new DetailsModel();

	constructor() {}
}
