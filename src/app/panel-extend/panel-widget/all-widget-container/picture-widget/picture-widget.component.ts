import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../model";

@Component({
	selector: "app-picture-widget",
	templateUrl: "./picture-widget.component.html",
	styleUrls: ["./picture-widget.component.scss"]
})
export class PictureWidgetComponent implements OnInit {
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
