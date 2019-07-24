import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";
import { PanelFacadeModel, PanelFilterModel } from "../../panel-widget-appearance/model";

@Component({
    selector: "app-panel-picture-site",
    templateUrl: "./panel-picture-site.component.html",
    styleUrls: ["../ant-collapse.scss"],
})
export class PanelPictureSiteComponent implements OnInit {
    @Input() public widget: PanelWidgetModel;

    constructor() {}

    ngOnInit() {}

    /**
     * 接受外观设置所有值的变化检测回调
     */
    public acceptFacadeValueChange(value: PanelFacadeModel): void {
        const text = this.widget.panelTextModel;
        const wHeight = this.widget.conventionSiteModel.height;
        let allStyle = {
            ...value.styleContent(),
            "line-height": text.styleContent(wHeight - (value.borderStyle != "none" ? value.borderNumber * 2 : 0))[
                "line-height"
            ],
        };
        this.widget.addStyleToUltimatelyStyle(allStyle);
        this.widget.panelFacadeModel.setData(value.getValue());
    }

    /**
     * 接受滤镜设置所有值的变化检测回调
     */
    public acceptFilterValueChange(value: PanelFilterModel): void {
        this.widget.addStyleToUltimatelyStyle(value.styleContent());
        this.widget.panelFilterModel.setData(value.getValue());
    }
}
