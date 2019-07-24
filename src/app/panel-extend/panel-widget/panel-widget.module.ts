import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DraggableModule } from "@ng-public/directive/draggable/draggable.module";
import { MousemoveoutModule } from "@ng-public/directive/mousemoveout/mousemoveout.module";
import { NgxAmapModule } from "ngx-amap";
import { DragulaModule } from "ng2-dragula";

import { PanelWidgetComponent } from "./panel-widget.component";
import { panelWidgetComponentList } from "./all-widget-container";
import { panelWidgetUnitList } from "./all-widget-unit";
import { panelWidgetVesselList } from "./all-widget-vessel";
import { ShareModule } from "@ng-share";
import { environment } from "environments/environment";

@NgModule({
    imports: [
        CommonModule,
        ShareModule,
        DraggableModule,
        MousemoveoutModule,
        DragulaModule,
        NgxAmapModule.forRoot({ apiKey: environment.mapApiKey }),
    ],
    exports: [PanelWidgetComponent, ...panelWidgetVesselList, ...panelWidgetComponentList],
    declarations: [PanelWidgetComponent, ...panelWidgetComponentList, ...panelWidgetUnitList, ...panelWidgetVesselList],
})
export class PanelWidgetModule {}
