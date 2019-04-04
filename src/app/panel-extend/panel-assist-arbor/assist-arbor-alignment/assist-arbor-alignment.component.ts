import { Component, OnInit } from "@angular/core";
import { PanelWidgetAppearanceService } from "../../panel-widget-appearance/panel-widget-appearance.service";
import { alignType } from "../../panel-widget-appearance/model";
import { PanelScopeEnchantmentService } from "../../panel-scope-enchantment/panel-scope-enchantment.service";

@Component({
	selector: "app-assist-arbor-alignment",
	templateUrl: "./assist-arbor-alignment.component.html",
	styleUrls: ["./assist-arbor-alignment.component.scss", "../dropdown.scss"]
})
export class AssistArborAlignmentComponent implements OnInit {
	// 是否允许设置对齐方式
	public get isAlign(): boolean {
		return this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere ? true : false;
	}
	// 是否允许设置水平等间距或垂直等间距
	public get isEqualDistanceSet(): boolean {
		return this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value.length > 2;
	}
	constructor(
		private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService,
		private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService
	) {}

	ngOnInit() {}

	/**
	 * 对齐方式
	 */
	public alignWay(type: alignType): void {
		if (this.isAlign) this.panelWidgetAppearanceService.launchAlignWay$.next(type);
	}
}
