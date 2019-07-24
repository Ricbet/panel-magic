import { Component, Renderer2, OnDestroy, OnInit } from "@angular/core";
import { Router, RouterEvent, NavigationEnd } from "@angular/router";

import { ImageGalleryService } from "@ng-public/image-gallery/image-gallery.service";

@Component({
    selector: "app-home",
    template: `
        <div class="main" id="main" [ngStyle]="{ filter: isVisibleImageDrawer ? 'blur(6px)' : '' }">
            <!-- 头部组件 -->
            <div class="aside-top">
                <div class="component-top-navbar" id="panel-top">
                    <app-top-navbar></app-top-navbar>
                </div>
            </div>

            <!-- 视图主体部分 -->
            <div class="aside-main">
                <!-- 内容主体部分 -->
                <div class="component-main" id="component-main" [ngStyle]="{ left: 0, top: 0, right: 0 }">
                    <app-panel-extend></app-panel-extend>
                </div>
            </div>
        </div>
        <!-- 选择图片组件 -->
        <app-image-gallery></app-image-gallery>
    `,
    styleUrls: ["./app.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
    public get isVisibleImageDrawer(): boolean {
        return this.imageGalleryService.isVisibleImageDrawer$.value;
    }

    constructor(
        private readonly renderer: Renderer2,
        private readonly router: Router,
        private readonly imageGalleryService: ImageGalleryService
    ) {
        // 监听路由变化
        this.router.events.subscribe((evt: RouterEvent) => this.resolveRouter(evt));
    }

    ngOnInit() {}

    ngOnDestroy() {}

    // 监听路由变化然后对loading效果进行设置
    public resolveRouter(evt: RouterEvent): void {
        if (evt instanceof NavigationEnd) {
            const ele = document.querySelector("#GLOBALLOADING");
            this.renderer.setStyle(ele, "display", "none");
        }
    }
}
