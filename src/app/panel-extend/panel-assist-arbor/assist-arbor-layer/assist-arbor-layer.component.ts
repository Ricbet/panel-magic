import { Component, OnInit } from "@angular/core";
import { PanelScopeEnchantmentService } from "../../panel-scope-enchantment/panel-scope-enchantment.service";
import { PanelExtendService } from "../../panel-extend.service";

@Component({
    selector: "app-assist-arbor-layer",
    templateUrl: "./assist-arbor-layer.component.html",
    styleUrls: ["./assist-arbor-layer.component.scss", "../dropdown.scss"],
})
export class AssistArborLayerComponent implements OnInit {
    // 是否允许设置图层
    public get isLayer(): boolean {
        return this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere ? true : false;
    }
    constructor(
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
        private readonly panelExtendService: PanelExtendService
    ) {}

    ngOnInit() {}

    /**
     * 置顶或置底
     */
    public handleZIndexTopOrBottom(type: "top" | "bottom"): void {
        if (this.isLayer) {
            const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$
                .value;
            this.panelExtendService.handleZIndexTopOrBottom(_inset_widget, type);
        }
    }

    /**
     * 上移一层或下移一层
     */
    public handleZIndexUpOrDown(type: "up" | "down"): void {
        if (this.isLayer) {
            const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$
                .value;
        }
    }
}
