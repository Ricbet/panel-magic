import { Component, OnInit, Input } from "@angular/core";

import { TabBarSiteViewService } from "../tab-bar-site-view.service";
import { WidgetModel } from "../../../../model/widget.model";

@Component({
    selector: "app-other-site",
    templateUrl: "./other-site.component.html",
    styleUrls: ["./other-site.component.scss"],
})
export class OtherSiteComponent implements OnInit {
    private _autoWidget: WidgetModel = new WidgetModel();

    public fontSize: string | number = 12;
    // 基本设置组件是否被选中
    public isNavBasicCheck: boolean = true;

    @Input()
    public get autoWidget(): WidgetModel {
        return this._autoWidget;
    }
    public set autoWidget(v: WidgetModel) {
        this._autoWidget = v;
        this.fontSize = parseInt(v["style"]["data"]["font-size"]);
    }

    constructor(public tbsvs: TabBarSiteViewService) {}

    ngOnInit() {}

    public handleChecked(type: string, checkValue: string): void {
        this.autoWidget["style"]["data"][type] =
            this.autoWidget["style"]["data"][type] == checkValue
                ? ((): string => {
                      let _str = "";
                      if (checkValue == "bold" || checkValue == "italic") _str = "normal";
                      if (checkValue == "underline") _str = "";
                      return "";
                  })()
                : checkValue;
    }

    public handleFontSize(size: number): void {
        this.autoWidget["style"]["data"]["font-size"] = size + "px";
    }
}
