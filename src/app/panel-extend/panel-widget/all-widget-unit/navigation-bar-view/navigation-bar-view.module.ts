import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationBarViewComponent } from "./navigation-bar-view.component";
import { NavigationBarSiteViewModule } from "./navigation-bar-site-view/navigation-bar-site-view.module";
import { NavigationBarViewService } from "./navigation-bar-view.service";

@NgModule({
	imports: [CommonModule, NavigationBarSiteViewModule],
	providers: [NavigationBarViewService],
	exports: [NavigationBarViewComponent],
	declarations: [NavigationBarViewComponent]
})
export class NavigationBarViewModule {}
