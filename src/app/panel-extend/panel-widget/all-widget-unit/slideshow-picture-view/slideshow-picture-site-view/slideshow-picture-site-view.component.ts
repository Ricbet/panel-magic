import { Component, OnInit, Input } from "@angular/core";
import { WidgetModel } from "../../../model/widget.model";

@Component({
	selector: "app-slideshow-picture-site-view",
	templateUrl: "./slideshow-picture-site-view.component.html",
	styles: [
		`
			.magic-square-site-site {
				padding: 16px;
				padding-top: 0;
			}
		`
	]
})
export class SlideshowPictureSiteViewComponent implements OnInit {
	private _autoWidget: WidgetModel = new WidgetModel();

	@Input()
	public set autoWidget(v: WidgetModel) {
		this._autoWidget = v;
	}
	public get autoWidget(): WidgetModel {
		return this._autoWidget;
	}

	constructor() {}

	ngOnInit() {}
}
