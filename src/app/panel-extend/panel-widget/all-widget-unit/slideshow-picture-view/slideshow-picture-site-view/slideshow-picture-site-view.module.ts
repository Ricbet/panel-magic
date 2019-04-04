import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DraggableModule } from "@ng-public/directive/draggable/draggable.module";

import { PictureAdImageItemComponent } from "./picture-ad-image-item/picture-ad-image-item.component";

import { PictureAdImageItemService } from "./picture-ad-image-item/picture-ad-image-item.service";
import { DragulaModule } from "ng2-dragula";
import { ShareModule } from "@ng-share";
import { PanelEventModule } from "app/panel-extend/panel-event/panel-event.module";

@NgModule({
	imports: [CommonModule, ShareModule, DragulaModule, PanelEventModule, DraggableModule],
	exports: [PictureAdImageItemComponent],
	providers: [PictureAdImageItemService],
	declarations: [PictureAdImageItemComponent]
})
export class SlideshowPictureSiteViewModule {}
