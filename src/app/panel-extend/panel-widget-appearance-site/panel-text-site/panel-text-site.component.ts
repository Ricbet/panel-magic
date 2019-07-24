import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";
import { PanelTextModel, PanelFacadeModel } from "../../panel-widget-appearance/model";

@Component({
    selector: "app-panel-text-site",
    templateUrl: "./panel-text-site.component.html",
    styleUrls: ["../ant-collapse.scss"],
})
export class PanelTextSiteComponent implements OnInit {
    @Input() public widget: PanelWidgetModel;

    constructor() {}

    ngOnInit() {}

    /**
     * 接收文本设置所有值的变化检测回调
     */
    public acceptTextSiteValueChange(value: PanelTextModel): void {
        if (value) {
            const wHeight = this.widget.conventionSiteModel.height;
            const wBorderWidth = this.widget.panelFacadeModel.borderNumber;
            const wBorderStyle = this.widget.panelFacadeModel.borderStyle;
            this.widget.addStyleToUltimatelyStyle(
                value.styleContent(wHeight - (wBorderStyle != "none" ? wBorderWidth * 2 : 0))
            );
            this.widget.panelTextModel.setData(value.getValue());
        }
    }

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
}
