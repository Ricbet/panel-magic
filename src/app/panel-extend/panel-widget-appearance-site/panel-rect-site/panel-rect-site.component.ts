import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";
import { PanelFacadeModel } from "../../panel-widget-appearance/model";

@Component({
	selector: "app-panel-rect-site",
	templateUrl: "./panel-rect-site.component.html",
	styleUrls: ["../ant-collapse.scss"]
})
export class PanelRectSiteComponent implements OnInit {
	@Input()
	public widget: PanelWidgetModel;

	constructor() {}

	ngOnInit() {}

	/**
	 * 接受外观设置所有值的变化检测回调
	 */
	public acceptFacadeValueChange(value: PanelFacadeModel): void {
		let _widget = this.widget;
		_widget.addStyleToUltimatelyStyle(value.styleContent());
		_widget.panelFacadeModel.setData(value.getValue());
	}
}
