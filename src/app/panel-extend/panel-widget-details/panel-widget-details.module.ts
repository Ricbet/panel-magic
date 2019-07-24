import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { PanelWidgetDetailsSiteComponent } from "./panel-widget-details.component";
import { PanelWidgetDetailsSiteService } from "./panel-widget-details.service";

import { DraggableModule } from "@ng-public/directive/draggable/draggable.module";

import { MyColorPickerModule } from "@ng-public/my-color-picker/my-color-picker.module";
import { MousemoveoutModule } from "@ng-public/directive/mousemoveout/mousemoveout.module";
import { DragulaModule } from "ng2-dragula";
import { NgxAmapModule, AmapAutocompleteService } from "ngx-amap";
import { QuillModule } from "ngx-quill";

import { panelWidgetUnitSiteList, panelWidgetUnitSiteModuleList } from "../panel-widget/all-widget-unit";
import { ShareModule } from "@ng-share";
import { environment } from "environments/environment";

@NgModule({
    imports: [
        CommonModule,
        ShareModule,
        DraggableModule,
        MyColorPickerModule,
        MousemoveoutModule,
        DragulaModule,
        NgxAmapModule.forRoot({ apiKey: environment.mapApiKey }),
        QuillModule.forRoot({
            modules: {
                toolbar: [
                    ["bold", "italic", "underline", "strike"],
                    ["blockquote", "code-block"],
                    [{ header: 1 }, { header: 2 }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ script: "sub" }, { script: "super" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ direction: "rtl" }],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ align: [] }],
                    ["clean"],
                    ["link", "image", "video"],
                ],
            },
        }),
        ...panelWidgetUnitSiteModuleList,
    ],
    exports: [PanelWidgetDetailsSiteComponent],
    providers: [PanelWidgetDetailsSiteService, AmapAutocompleteService],
    entryComponents: [...panelWidgetUnitSiteList],
    declarations: [PanelWidgetDetailsSiteComponent, ...panelWidgetUnitSiteList],
})
export class PanelWidgetDetailsSiteModule {}
