import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";
import { PanelFacadeModel, PanelFilterModel } from "../../panel-widget-appearance/model";

@Component({
	selector: "app-panel-picture-site",
	templateUrl: "./panel-picture-site.component.html",
	styleUrls: ["../ant-collapse.scss"]
})
export class PanelPictureSiteComponent implements OnInit {
	@Input() public widget: PanelWidgetModel;

	constructor() {}

	ngOnInit() {}

	/**
	 * 接受外观设置所有值的变化检测回调
	 */
	public acceptFacadeValueChange(value: PanelFacadeModel): void {
		let _widget = this.widget;
		const _text = _widget.panelTextModel;
		const _w_height = _widget.conventionSiteModel.height;
		let _all_style = {
			...value.styleContent(),
			"line-height": _text.styleContent(_w_height - (value.borderStyle != "none" ? value.borderNumber * 2 : 0))[
				"line-height"
			]
		};
		_widget.addStyleToUltimatelyStyle(_all_style);
		_widget.panelFacadeModel.setData(value.getValue());
	}

	/**
	 * 接受滤镜设置所有值的变化检测回调
	 */
	public acceptFilterValueChange(value: PanelFilterModel): void {
		this.widget.addStyleToUltimatelyStyle(value.styleContent());
		this.widget.panelFilterModel.setData(value.getValue());
	}
}
