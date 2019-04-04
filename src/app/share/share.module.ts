import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { NgZorroAntdModule } from "ng-zorro-antd";
import { PipesModule } from "@ng-public/pipe/pipe.module";
import { NgThumbAutoModule } from "@ng-public/ng-thumb-auto";

// share 模版一般用于一些通用模块和功能的再次导出，这些模块和功能在应用中到处可用到，减少引入成本
@NgModule({
	imports: [CommonModule, NgZorroAntdModule],
	exports: [CommonModule, ReactiveFormsModule, FormsModule, NgZorroAntdModule, PipesModule, NgThumbAutoModule]
})
export class ShareModule {}
