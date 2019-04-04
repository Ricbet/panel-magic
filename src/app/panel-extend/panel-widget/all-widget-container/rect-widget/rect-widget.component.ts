import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../model";
import { rectWidget } from "./rect.widget.data";

@Component({
	selector: "app-rect-widget",
	templateUrl: "./rect-widget.component.html",
	styleUrls: ["./rect-widget.component.scss"]
})
export class RectWidgetComponent implements OnInit {
	private _widget: PanelWidgetModel;

	@Input()
	public get widget(): PanelWidgetModel {
		return this._widget;
	}
	public set widget(v: PanelWidgetModel) {
		this._widget = v;
	}
	constructor() {}

	ngOnInit() {}
}
