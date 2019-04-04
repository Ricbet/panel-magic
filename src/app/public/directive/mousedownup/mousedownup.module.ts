import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MousedownupDirective } from "./mousedownup.directive";

import { MousedownupService } from "./mousedownup.service";

@NgModule({
	imports: [CommonModule],
	exports: [MousedownupDirective],
	providers: [MousedownupService],
	declarations: [MousedownupDirective]
})
export class MousedownupModule {}
