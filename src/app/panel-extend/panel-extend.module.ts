import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { PanelExtendComponent } from "./panel-extend.component";
import { PanelExtendService } from "./panel-extend.service";
import { PanelScopeEnchantmentService } from "./panel-scope-enchantment/panel-scope-enchantment.service";
import { DraggableTensileCursorService } from "./panel-scope-enchantment/draggable-tensile-cursor.service";
import { ClipPathResizeMaskService } from "./panel-scope-enchantment/clip-path-resize-mask.service";
import { PanelLayerService } from "./panel-layer/panel-layer.service";
import { PanelExtendMoveBackService } from "./panel-extend-move-back.service";
import { PanelScaleplateService } from "./panel-scaleplate/panel-scaleplate.service";

import { DragulaModule } from "ng2-dragula";
import { MyColorPickerModule } from "@ng-public/my-color-picker/my-color-picker.module";
import { DraggableModule } from "@ng-public/directive/draggable/draggable.module";
import { MousescrollModule } from "@ng-public/directive/mousescroll/mousescroll.module";
import { MousedownupModule } from "@ng-public/directive/mousedownup/mousedownup.module";
import { MousemoveoutModule } from "@ng-public/directive/mousemoveout/mousemoveout.module";
import { PanelWidgetAppearanceModule } from "./panel-widget-appearance/panel-widget-appearance.module";
import { PanelSoulModule } from "./panel-soul/panel-soul.module";
import { PanelAssistArborModule } from "./panel-assist-arbor/panel-assist-arbor.module";
import { PanelWidgetModule } from "./panel-widget/panel-widget.module";
import { PanelWidgetDetailsSiteModule } from "./panel-widget-details/panel-widget-details.module";
import { PanelCatalogueModule } from "./panel-catalogue/panel-catalogue.module";
import { PanelShellModule } from "./panel-shell/panel-shell.module";

import { PanelScaleplateComponent } from "./panel-scaleplate/panel-scaleplate.component";
import { PanelScopeEnchantmentComponent } from "./panel-scope-enchantment/panel-scope-enchantment.component";
import { PanelScopeTextEditorComponent } from "./panel-scope-enchantment/panel-scope-text-editor/panel-scope-text-editor.component";
import { PanelLayerComponent } from "./panel-layer/panel-layer.component";

import { PanelEventModule } from "./panel-event/panel-event.module";
import { PanelExtendQuickShortcutsService } from "./panel-extend-quick-shortcuts.service";
import { PanelSeniorVesselEditModule } from "./panel-senior-vessel-edit/panel-senior-vessel-edit.module";
import { ShareModule } from "@ng-share";

@NgModule({
	imports: [
		CommonModule,
		ShareModule,
		DraggableModule,
		MousescrollModule,
		MousedownupModule,
		MousemoveoutModule,
		FormsModule,
		PanelWidgetAppearanceModule,
		MyColorPickerModule,
		PanelSoulModule,
		PanelAssistArborModule,
		PanelWidgetModule,
		PanelWidgetDetailsSiteModule,
		PanelCatalogueModule,
		PanelSeniorVesselEditModule,
		DragulaModule,
		PanelShellModule,
		PanelEventModule
	],
	providers: [
		PanelExtendService,
		PanelScopeEnchantmentService,
		DraggableTensileCursorService,
		ClipPathResizeMaskService,
		PanelLayerService,
		PanelExtendMoveBackService,
		PanelExtendQuickShortcutsService,
		PanelScaleplateService
	],
	exports: [PanelExtendComponent],
	declarations: [
		PanelExtendComponent,
		PanelScaleplateComponent,
		PanelScopeEnchantmentComponent,
		PanelScopeTextEditorComponent,
		PanelLayerComponent
	]
})
export class PanelExtendModule {}
