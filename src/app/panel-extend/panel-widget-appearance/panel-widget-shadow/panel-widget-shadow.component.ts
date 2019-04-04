import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { PanelWidgetAppearanceService } from "../panel-widget-appearance.service";
import { PanelShadowModel } from "../model";
import { PanelWidgetModel } from "../../panel-widget/model";
import { PanelScopeEnchantmentService } from "../../panel-scope-enchantment/panel-scope-enchantment.service";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
	selector: "app-panel-widget-shadow",
	templateUrl: "./panel-widget-shadow.component.html",
	styleUrls: ["./panel-widget-shadow.component.scss"]
})
export class PanelWidgetShadowComponent implements OnInit {
	@Input() public widget: PanelWidgetModel;

	// 阴影设置的所有值变化可订阅对象
	private panelShadowValueChangeRX$: Subscription;
	public get panelShadow(): PanelShadowModel {
		return this.panelWidgetAppearanceService.panelShadowModel$.value;
	}

	constructor(private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService) {
		this.panelShadowValueChangeRX$ = this.panelShadow.valueChange$.pipe(debounceTime(10)).subscribe(value => {
			if (value) {
				this.handleOnesInsetWidgetShadow();
			}
		});
	}

	ngOnInit() {}
	ngOnDestroy() {
		if (this.panelShadowValueChangeRX$) this.panelShadowValueChangeRX$.unsubscribe();
	}

	ngOnChanges(change: SimpleChanges) {
		if (change.widget) {
			if (this.widget.panelShadowModel) {
				this.panelShadow.setData(this.widget.panelShadowModel.getValue());
			}
		}
	}

	/**
	 * 处理阴影所有值的变化
	 */
	public handleOnesInsetWidgetShadow(): void {
		const _shadow = this.panelShadow;
		let _widget = this.widget;
		_widget.addStyleToUltimatelyStyle(_shadow.styleContent());
		_widget.panelShadowModel.setData(_shadow.getValue());
	}
}
