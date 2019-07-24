import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-panel-soul-quick-shortcuts-modal",
    templateUrl: "./panel-soul-quick-shortcuts-modal.component.html",
    styleUrls: ["./panel-soul-quick-shortcuts-modal.component.scss"],
})
export class PanelSoulQuickShortcutsModalComponent implements OnInit {
    // 获取当前浏览器系统信息判断是window系统还是mac系统
    public currentNavigatorVersion: "Mac" | "Windows";

    constructor() {}

    ngOnInit() {
        const _nav = navigator.appVersion;
        if (_nav.includes("Mac")) {
            this.currentNavigatorVersion = "Mac";
        } else if (_nav.includes("Windows")) {
            this.currentNavigatorVersion = "Windows";
        }
    }
}
