import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { PanelCatalogueComponent } from "./panel-catalogue.component";
import { PanelCatalogueService } from "./panel-catalogue.service";

import { NewItemComponent } from "./new-item/new-item.component";
import { PanelSeniorVesselEditModule } from "../panel-senior-vessel-edit/panel-senior-vessel-edit.module";
import { ShareModule } from "@ng-share";

@NgModule({
	imports: [PanelSeniorVesselEditModule, CommonModule, ShareModule],
	exports: [PanelCatalogueComponent],
	providers: [PanelCatalogueService],
	declarations: [PanelCatalogueComponent, NewItemComponent]
})
export class PanelCatalogueModule {}
