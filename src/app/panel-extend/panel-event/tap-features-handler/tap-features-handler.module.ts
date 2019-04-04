import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TapFeaturesHandlerComponent } from "./tap-features-handler.component";
import { ShareModule } from "@ng-share";
import { TapFeaturesHandlerService } from "./tap-features-handler.service";
import { MapHandlerComponent } from "./map-handler/map-handler.component";
import { NgxAmapModule } from "ngx-amap";
import { environment } from "environments/environment";

@NgModule({
	imports: [CommonModule, ShareModule, NgxAmapModule.forRoot({ apiKey: environment.mapApiKey })],
	providers: [TapFeaturesHandlerService],
	exports: [TapFeaturesHandlerComponent],
	declarations: [TapFeaturesHandlerComponent, MapHandlerComponent]
})
export class TapFeaturesHandlerModule {}
