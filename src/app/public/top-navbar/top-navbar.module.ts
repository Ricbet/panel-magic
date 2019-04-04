import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TopNavbarComponent } from "./top-navbar.component";
import { TopNavbarService } from "./top-navbar.service";

import { ShareModule } from "@ng-share";

@NgModule({
	imports: [CommonModule, ShareModule],
	providers: [TopNavbarService],
	exports: [TopNavbarComponent],
	declarations: [TopNavbarComponent]
})
export class TopNavbarModule {}
