import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { PanelScopeEnchantmentService } from "../panel-scope-enchantment/panel-scope-enchantment.service";

@Injectable({
	providedIn: "root"
})
export class PanelAssistArborService {
	// 发射组合数据源
	public launchCreateCombination$: Subject<never> = new Subject<never>();
	// 发射打散数据源
	public launchDisperseCombination$: Subject<never> = new Subject<never>();

	// 是否允许设置组合，需要选中多个组件才能创建组合
	public get isCombination(): boolean {
		return this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value.length > 1;
	}

	// 是否允许设置打散，需要备选组件当中有组合元素组件
	public get isDisperse(): boolean {
		return this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value.some(
			_e => _e.type == "combination"
		);
	}

	constructor(private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService) {}
}
