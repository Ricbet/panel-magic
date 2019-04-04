import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";
import { PanelTextModel, PanelFacadeModel } from "../../panel-widget-appearance/model";

@Component({
	selector: "app-panel-button-site",
	templateUrl: "./panel-button-site.component.html",
	styleUrls: ["../ant-collapse.scss"]
})
export class PanelButtonSiteComponent implements OnInit {
	@Input() public widget: PanelWidgetModel;

	constructor() {}

	ngOnInit() {}

	/**
	 * 接收文本设置所有值的变化检测回调
	 */
	public acceptTextSiteValueChange(value: PanelTextModel): void {
		if (value) {
			let _widget = this.widget;
			const _w_height = _widget.conventionSiteModel.height;
			const _w_border_width = _widget.panelFacadeModel.borderNumber;
			const _w_border_style = _widget.panelFacadeModel.borderStyle;
			_widget.addStyleToUltimatelyStyle(
				value.styleContent(_w_height - (_w_border_style != "none" ? _w_border_width * 2 : 0))
			);
			_widget.panelTextModel.setData(value.getValue());
		}
	}

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
}
