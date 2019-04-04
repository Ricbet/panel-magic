import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";
import { PanelWidgetAppearanceService } from "../../panel-widget-appearance/panel-widget-appearance.service";
import { PanelScopeEnchantmentService } from "../../panel-scope-enchantment/panel-scope-enchantment.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-panel-slideshow-picture-site",
	template: ``,
	styles: [``]
})
export class PanelSlideshowPictureSiteComponent implements OnInit, OnDestroy {
	private profileOutershpere$: Subscription;
	@Input()
	public widget: PanelWidgetModel;

	constructor(
		private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService,
		private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService
	) {
		this.profileOutershpere$ = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.subscribe(
			value => {
				if (Array.isArray(value) && value.length == 1 && value.find(_w => _w.type == "slideshowpicture")) {
					Promise.resolve(null).then(() => {
						this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere.isRotate = false;
					});
				}
			}
		);
	}

	ngOnInit() {}

	ngOnDestroy() {
		if (this.profileOutershpere$) this.profileOutershpere$.unsubscribe();
	}

	ngAfterContentInit() {
		Promise.resolve(null).then(() => {
			this.panelWidgetAppearanceService.isOpenAnimation$.next(false);
			this.panelWidgetAppearanceService.isOpenRotate$.next(false);
			this.panelWidgetAppearanceService.isOpenOpacity$.next(false);
			this.panelWidgetAppearanceService.isOpenWidth$.next(true);
			this.panelWidgetAppearanceService.isOpenHeight$.next(true);
		});
	}
}
