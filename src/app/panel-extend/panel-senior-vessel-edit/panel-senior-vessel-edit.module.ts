import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DraggableModule } from "@ng-public/directive/draggable/draggable.module";

import { PanelSeniorVesselEditComponent } from "./panel-senior-vessel-edit.component";
import { PanelSeniorVesselEditService } from "./panel-senior-vessel-edit.service";
import { PanelWidgetModule } from "../panel-widget/panel-widget.module";
import { PanelSeniorVesselStatusCollectionComponent } from "./panel-senior-vessel-status-collection/panel-senior-vessel-status-collection.component";
import { PanelSeniorVesselStatusCollectionService } from "./panel-senior-vessel-status-collection/panel-senior-vessel-status-collection.service";
import { ShareModule } from "@ng-share";

@NgModule({
    imports: [CommonModule, ShareModule, PanelWidgetModule, DraggableModule],
    providers: [PanelSeniorVesselEditService, PanelSeniorVesselStatusCollectionService],
    exports: [PanelSeniorVesselEditComponent, PanelSeniorVesselStatusCollectionComponent],
    declarations: [PanelSeniorVesselEditComponent, PanelSeniorVesselStatusCollectionComponent],
})
export class PanelSeniorVesselEditModule {}
