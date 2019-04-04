import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ColorSketchModule } from "ngx-color/sketch";
import { MyColorPickerComponent } from "./my-color-picker.component";

import { ShareModule } from "@ng-share";

@NgModule({
	imports: [CommonModule, ShareModule, ColorSketchModule],
	exports: [MyColorPickerComponent],
	declarations: [MyColorPickerComponent]
})
export class MyColorPickerModule {}
