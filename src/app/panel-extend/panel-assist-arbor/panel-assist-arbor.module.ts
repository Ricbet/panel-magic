import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PanelAssistArborComponent } from "./panel-assist-arbor.component";
import { PanelAssistArborService } from "./panel-assist-arbor.service";
import { AssistArborOperationComponent } from "./assist-arbor-operation/assist-arbor-operation.component";
import { AssistArborAlignmentComponent } from "./assist-arbor-alignment/assist-arbor-alignment.component";
import { AssistArborLayerComponent } from "./assist-arbor-layer/assist-arbor-layer.component";
import { ShareModule } from "@ng-share";

@NgModule({
    imports: [CommonModule, ShareModule],
    providers: [PanelAssistArborService],
    exports: [PanelAssistArborComponent],
    declarations: [
        PanelAssistArborComponent,
        AssistArborOperationComponent,
        AssistArborAlignmentComponent,
        AssistArborLayerComponent,
    ],
})
export class PanelAssistArborModule {}
