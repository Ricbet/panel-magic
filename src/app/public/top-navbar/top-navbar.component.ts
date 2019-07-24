import { Component, OnInit } from "@angular/core";

import { AppDataService } from "../../appdata/appdata.service";
import { AppDataModel } from "app/appdata";

@Component({
    selector: "app-top-navbar",
    templateUrl: "./top-navbar.component.html",
    styleUrls: ["./top-navbar.component.scss"],
})
export class TopNavbarComponent implements OnInit {
    // 当前页面内容的信息
    public get appDataInfo(): AppDataModel {
        return this.appDataService.appDataModel;
    }

    constructor(private readonly appDataService: AppDataService) {}

    ngOnInit() {}
}
