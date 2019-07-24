import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PanelSoulComponent } from "./panel-soul.component";
import { PanelSoulQuickShortcutsModalComponent } from "./panel-soul-quick-shortcuts-modal/panel-soul-quick-shortcuts-modal.component";
import { PanelAddNewVesselWidgetModalComponent } from "./panel-add-new-vessel-widget-modal/panel-add-new-vessel-widget-modal.component";
import { ShareModule } from "@ng-share";

@NgModule({
    imports: [CommonModule, ShareModule],
    exports: [PanelSoulComponent],
    declarations: [PanelSoulComponent, PanelSoulQuickShortcutsModalComponent, PanelAddNewVesselWidgetModalComponent],
})
export class PanelSoulModule {}
