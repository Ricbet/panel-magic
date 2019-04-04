import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MyColorPickerModule } from "@ng-public/my-color-picker/my-color-picker.module";

import { NavigationListComponent } from "./navigation-list/navigation-list.component";
import { OtherSiteComponent } from "./other-site/other-site.component";

import { TabBarSiteViewService } from "./tab-bar-site-view.service";
import { ShareModule } from "@ng-share";
import { PanelEventModule } from "app/panel-extend/panel-event/panel-event.module";

@NgModule({
	imports: [CommonModule, ShareModule, MyColorPickerModule, PanelEventModule],
	exports: [NavigationListComponent, OtherSiteComponent],
	providers: [TabBarSiteViewService],
	declarations: [NavigationListComponent, OtherSiteComponent]
})
export class TabBarSiteViewModule {}
