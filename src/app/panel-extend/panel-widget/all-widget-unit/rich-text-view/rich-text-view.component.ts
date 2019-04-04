import { Component, OnInit, Input, ViewEncapsulation, ElementRef, ViewChild } from "@angular/core";
import { WidgetModel } from "../../model/widget.model";
import { PanelWidgetModel } from "../../model";
import { PanelScopeEnchantmentService } from "../../../panel-scope-enchantment/panel-scope-enchantment.service";

@Component({
	selector: "app-rich-text-view",
	templateUrl: "./rich-text-view.component.html",
	styleUrls: ["./rich-text-view.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class RichTextViewComponent implements OnInit {
	@ViewChild("richTextEl", { static: true }) public richTextEl: ElementRef;

	private _autoWidget: PanelWidgetModel;
	public widgetModel: WidgetModel;

	@Input()
	public get autoWidget(): PanelWidgetModel {
		return this._autoWidget;
	}
	public set autoWidget(v: PanelWidgetModel) {
		if (v["type"] != "") {
			this.widgetModel = v.autoWidget;
			this.widgetModel.customfeature = {
				changeDetected: () => {
					const _rich_height = this.richTextEl.nativeElement.getBoundingClientRect().height;
					if (v.profileModel.height < _rich_height) {
						v.profileModel.setData({
							height: _rich_height
						});
						v.addStyleToUltimatelyStyle({
							height: _rich_height + "px"
						});
						this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere.setSourceDataNoLaunch(
							{
								height: _rich_height
							}
						);
					}
				}
			};
		}
	}

	constructor(private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService) {}

	ngOnInit() {}
}
