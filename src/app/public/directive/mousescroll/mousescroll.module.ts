import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MousescrollDirective } from "./mousescroll.directive";
import { MousescrollService } from "./mousescroll.service";

@NgModule({
    imports: [CommonModule],
    exports: [MousescrollDirective],
    providers: [MousescrollService],
    declarations: [MousescrollDirective],
})
export class MousescrollModule {}
