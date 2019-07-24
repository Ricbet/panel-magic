import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DraggableModule } from "@ng-public/directive/draggable/draggable.module";
import { MyColorPickerModule } from "@ng-public/my-color-picker/my-color-picker.module";

import { PanelWidgetAppearanceComponent } from "./panel-widget-appearance.component";
import { PanelWidgetAppearanceService } from "./panel-widget-appearance.service";
import { PanelWidgetTextComponent } from "./panel-widget-text/panel-widget-text.component";
import { PanelWidgetFacadeComponent } from "./panel-widget-facade/panel-widget-facade.component";
import { PanelWidgetShadowComponent } from "./panel-widget-shadow/panel-widget-shadow.component";
import { panelSiteComponentList } from "../panel-widget-appearance-site";
import { PanelWidgetPictureComponent } from "./panel-widget-picture/panel-widget-picture.component";
import { PanelWidgetFilterComponent } from "./panel-widget-filter/panel-widget-filter.component";
import { PanelWidgetClipPathComponent } from "./panel-widget-clip-path/panel-widget-clip-path.component";
import { PanelWidgetAnimationComponent } from "./panel-widget-animation/panel-widget-animation.component";
import { ShareModule } from "@ng-share";

@NgModule({
    imports: [CommonModule, ShareModule, DraggableModule, MyColorPickerModule],
    providers: [PanelWidgetAppearanceService],
    exports: [PanelWidgetAppearanceComponent],
    entryComponents: [...panelSiteComponentList],
    declarations: [
        PanelWidgetAppearanceComponent,
        PanelWidgetTextComponent,
        PanelWidgetFacadeComponent,
        PanelWidgetShadowComponent,
        ...panelSiteComponentList,
        PanelWidgetPictureComponent,
        PanelWidgetFilterComponent,
        PanelWidgetClipPathComponent,
        PanelWidgetAnimationComponent,
    ],
})
export class PanelWidgetAppearanceModule {}
