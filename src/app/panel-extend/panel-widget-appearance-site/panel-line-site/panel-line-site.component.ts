import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";
import { PanelWidgetAppearanceService } from "../../panel-widget-appearance/panel-widget-appearance.service";
import { PanelFacadeModel, TBorderStyle } from "../../panel-widget-appearance/model";

@Component({
    selector: "app-panel-line-site",
    templateUrl: "./panel-line-site.component.html",
    styleUrls: ["../ant-collapse.scss"],
})
export class PanelLineSiteComponent implements OnInit {
    @Input() public widget: PanelWidgetModel;

    constructor(private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService) {}

    ngOnInit() {
        const styleObj = <Object>this.widget.autoWidget.style.children[0].data;
        const borderColor = {
            borderColor: "",
            borderStyle: "none",
            borderNumber: "",
        };
        if (styleObj.hasOwnProperty("border-top-color")) {
            borderColor.borderColor = styleObj["border-top-color"];
        }
        if (styleObj.hasOwnProperty("border-top-style")) {
            borderColor.borderStyle = styleObj["border-top-style"];
        }
        if (styleObj.hasOwnProperty("border-top-width")) {
            borderColor.borderNumber = styleObj["border-top-width"].replace("px", "");
        }
        const panelFacade$ = this.panelWidgetAppearanceService.panelFacadeModel$;
        panelFacade$.value.resetData();
        panelFacade$.value.setData({
            borderColor: borderColor.borderColor,
            borderStyle: <TBorderStyle>borderColor.borderStyle,
            borderNumber: <any>borderColor.borderNumber * 1,
        });
    }

    /**
     * 接收边框值的变化
     */
    public acceptFacadeValueChange(value: PanelFacadeModel): void {
        const lineStyle = this.widget.autoWidget.style.children[0].data;
        const bStyleType = value.borderStyle;
        const styleToNumber = {
            solid: 1,
            dotted: 2,
            dashed: 3,
        };
        if (styleToNumber[bStyleType]) this.widget.autoWidget.content.type = styleToNumber[bStyleType];
        this.widget.autoWidget.content.borderWidth = value.borderNumber;
        this.widget.autoWidget.content.bgColor = value.borderColor;
        lineStyle["border-top-color"] = value.borderColor;
        lineStyle["border-top-style"] = value.borderStyle;
        lineStyle["border-top-width"] = value.borderNumber + "px";
    }
}
