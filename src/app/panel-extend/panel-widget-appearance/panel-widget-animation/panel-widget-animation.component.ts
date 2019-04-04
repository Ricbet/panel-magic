import { Component, OnInit, OnDestroy } from "@angular/core";
import { PanelWidgetAppearanceService } from "../panel-widget-appearance.service";
import {
	PanelAnimationModel,
	animationLabelDelayOptions,
	animationLabelDurationOptions,
	animationIterationCountOptions
} from "../model";
import { Subscription } from "rxjs";
import { PanelScopeEnchantmentService } from "../../panel-scope-enchantment/panel-scope-enchantment.service";

@Component({
	selector: "app-panel-widget-animation",
	templateUrl: "./panel-widget-animation.component.html",
	styleUrls: ["./panel-widget-animation.component.scss"]
})
export class PanelWidgetAnimationComponent implements OnInit, OnDestroy {
	// 待选择的延时列表
	public animationLabelDelayOptions: Array<{ value: string; label: string }> = animationLabelDelayOptions;
	// 待选择的时长列表
	public animationLabelDurationOptions: Array<{ value: string; label: string }> = animationLabelDurationOptions;
	// 待选择的重复次数列表
	public animationIterationCountOptions: Array<{ value: string; label: string }> = animationIterationCountOptions;
	// 待选择的动效列表
	public get awaitAnimationOptions(): Array<{ value: string; label: string }> {
		return this.panelWidgetAppearanceService.awaitCheckAnimationNameList;
	}
	// 主轮廓的可订阅对象
	public profileOuterSphereRX$: Subscription;

	public get panelAnimationModel(): PanelAnimationModel {
		return this.panelWidgetAppearanceService.panelAnimationModel$.value;
	}

	constructor(
		private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService,
		private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService
	) {
		this.profileOuterSphereRX$ = this.panelScopeEnchantmentService.scopeEnchantmentModel.profileOuterSphere$.subscribe(
			value => {
				if (value) {
					const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel
						.outerSphereInsetWidgetList$.value;
					if (_inset_widget.length == 1) {
						const _only_widget = _inset_widget[0];
						this.panelAnimationModel.setData(_only_widget.panelAnimationModel.getValue());
					} else {
						this.panelAnimationModel.resetData();
					}
				}
			}
		);
	}

	ngOnInit() {}

	ngOnDestroy() {
		if (this.profileOuterSphereRX$) this.profileOuterSphereRX$.unsubscribe();
	}

	/**
	 * 接收选择框的改变回调
	 */
	public acceptSelectChange(): void {
		const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
		if (Array.isArray(_inset_widget)) {
			_inset_widget.forEach(_w => {
				_w.panelAnimationModel.setData(this.panelAnimationModel.getValue());
				_w.addStyleToUltimatelyStyle(this.panelAnimationModel.styleContent);
			});
		}
	}
}
