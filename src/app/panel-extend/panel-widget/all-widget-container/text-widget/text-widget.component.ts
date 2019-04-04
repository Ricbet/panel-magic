import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../model";

@Component({
	selector: "app-text-widget",
	templateUrl: "./text-widget.component.html",
	styleUrls: ["./text-widget.component.scss"]
})
export class TextWidgetComponent implements OnInit {
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
