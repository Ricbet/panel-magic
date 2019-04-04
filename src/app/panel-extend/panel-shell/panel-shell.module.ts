import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MyColorPickerModule } from "@ng-public/my-color-picker/my-color-picker.module";
import { DraggableModule } from "@ng-public/directive/draggable/draggable.module";

import { TabBarViewModule } from "../panel-widget/all-widget-unit/tab-bar-view/tab-bar-view.module";
import { NavigationBarViewModule } from "../panel-widget/all-widget-unit/navigation-bar-view/navigation-bar-view.module";

import { PanelShellComponent } from "./panel-shell.component";
import { ShareModule } from "@ng-share";

@NgModule({
	imports: [
		CommonModule,
		ShareModule,
		MyColorPickerModule,
		DraggableModule,
		TabBarViewModule,
		NavigationBarViewModule
	],
	exports: [PanelShellComponent],
	declarations: [PanelShellComponent]
})
export class PanelShellModule {}
