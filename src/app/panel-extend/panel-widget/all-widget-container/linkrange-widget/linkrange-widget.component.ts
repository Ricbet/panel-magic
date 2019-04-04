import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { PanelWidgetModel } from "../../model";
import { Subscription } from "rxjs";

@Component({
	selector: "app-linkrange-widget",
	templateUrl: "./linkrange-widget.component.html",
	styleUrls: ["./linkrange-widget.component.scss"]
})
export class LinkrangeWidgetComponent implements OnInit {
	// 订阅值变化
	private profileValueChangeRX$: Subscription;

	private _widget: PanelWidgetModel;

	@Input()
	public get widget(): PanelWidgetModel {
		return this._widget;
	}
	public set widget(v: PanelWidgetModel) {
		this._widget = v;
		this.openValueChange();
	}
	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {
		if (this.profileValueChangeRX$) this.profileValueChangeRX$.unsubscribe();
	}

	/**
	 * 开启监听
	 */
	public openValueChange(): void {
		this.profileValueChangeRX$ = this.widget.profileModel.valueChange$.pipe().subscribe(value => {
			this.widget.profileModel.setSourceDataNoLaunch({
				rotate: 0,
				opacity: 100
			});
		});
	}
}
