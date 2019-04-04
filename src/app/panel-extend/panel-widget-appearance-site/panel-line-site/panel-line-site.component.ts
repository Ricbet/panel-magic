import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";
import { PanelWidgetAppearanceService } from "../../panel-widget-appearance/panel-widget-appearance.service";
import { PanelFacadeModel, TBorderStyle } from "../../panel-widget-appearance/model";

@Component({
	selector: "app-panel-line-site",
	templateUrl: "./panel-line-site.component.html",
	styleUrls: ["../ant-collapse.scss"]
})
export class PanelLineSiteComponent implements OnInit {
	@Input() public widget: PanelWidgetModel;

	constructor(private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService) {}

	ngOnInit() {
		const _style_obj = <Object>this.widget.autoWidget.style.children[0].data;
		const _border_color = {
			borderColor: "",
			borderStyle: "none",
			borderNumber: ""
		};
		if (_style_obj.hasOwnProperty("border-top-color")) {
			_border_color["borderColor"] = _style_obj["border-top-color"];
		}
		if (_style_obj.hasOwnProperty("border-top-style")) {
			_border_color["borderStyle"] = _style_obj["border-top-style"];
		}
		if (_style_obj.hasOwnProperty("border-top-width")) {
			_border_color["borderNumber"] = _style_obj["border-top-width"].replace("px", "");
		}
		const _panel_facade$ = this.panelWidgetAppearanceService.panelFacadeModel$;
		_panel_facade$.value.resetData();
		_panel_facade$.value.setData({
			borderColor: _border_color.borderColor,
			borderStyle: <TBorderStyle>_border_color.borderStyle,
			borderNumber: <any>_border_color.borderNumber * 1
		});
	}

	/**
	 * 接收边框值的变化
	 */
	public acceptFacadeValueChange(value: PanelFacadeModel): void {
		let _line_style = this.widget.autoWidget.style.children[0].data;
		const _b_style_type = value.borderStyle;
		const _style_to_number = {
			solid: 1,
			dotted: 2,
			dashed: 3
		};
		if (_style_to_number[_b_style_type]) {
			this.widget.autoWidget.content["type"] = _style_to_number[_b_style_type];
		}
		this.widget.autoWidget.content["borderWidth"] = value.borderNumber;
		this.widget.autoWidget.content["bgColor"] = value.borderColor;
		_line_style["border-top-color"] = value.borderColor;
		_line_style["border-top-style"] = value.borderStyle;
		_line_style["border-top-width"] = value.borderNumber + "px";
	}
}
