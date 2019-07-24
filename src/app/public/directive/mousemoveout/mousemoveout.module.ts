import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MousemoveoutDirective } from "./mousemoveout.directive";

@NgModule({
    imports: [CommonModule],
    exports: [MousemoveoutDirective],
    declarations: [MousemoveoutDirective],
})
export class MousemoveoutModule {}
