import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TabBarSiteViewModule } from "./tab-bar-site-view/tab-bar-site-view.module";

import { TabBarViewComponent } from "./tab-bar-view.component";
import { TabBarViewService } from "./tab-bar-view.service";
import { ShareModule } from "@ng-share";

@NgModule({
    imports: [CommonModule, TabBarSiteViewModule, ShareModule],
    providers: [TabBarViewService],
    exports: [TabBarViewComponent],
    declarations: [TabBarViewComponent],
})
export class TabBarViewModule {}
