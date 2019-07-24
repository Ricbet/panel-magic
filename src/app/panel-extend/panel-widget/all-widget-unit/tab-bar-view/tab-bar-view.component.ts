import { Component, OnInit } from "@angular/core";

import { TabBarViewService } from "./tab-bar-view.service";
import { WidgetModel } from "../../model/widget.model";

@Component({
    selector: "app-tab-bar-view",
    templateUrl: "./tab-bar-view.component.html",
    styleUrls: ["./tab-bar-view.component.scss"],
})
export class TabBarViewComponent implements OnInit {
    public get autoTabbarWidget(): WidgetModel {
        return this.tabBarViewService.tabbarWidgetModel.autoWidget;
    }

    constructor(private tabBarViewService: TabBarViewService) {
        console.log(this.autoTabbarWidget, "auto");
    }

    ngOnInit() {}
}
