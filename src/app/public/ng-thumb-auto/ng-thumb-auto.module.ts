import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgZorroAntdModule } from "ng-zorro-antd";

import { MgrThumbAutoComponent } from "./ng-thumb-auto.component";

@NgModule({
    imports: [CommonModule, NgZorroAntdModule],
    declarations: [MgrThumbAutoComponent],
    exports: [MgrThumbAutoComponent],
})
export class NgThumbAutoModule {}
