import { Component, OnInit, Input } from "@angular/core";
import { Subscription } from "rxjs";

import { TabbarModel } from "../model";
import { TabBarSiteViewService } from "../tab-bar-site-view.service";
import { ImageGalleryService } from "@ng-public/image-gallery/image-gallery.service";
import { ImageModel } from "@ng-public/image-gallery/model/image.model";

@Component({
	selector: "app-navigation-list",
	templateUrl: "./navigation-list.component.html",
	styleUrls: ["./navigation-list.component.scss"]
})
export class NavigationListComponent implements OnInit {
	public imageGallertRX$: Subscription;

	public currentNavImageData: any; // 选中的导航信息
	public currentNavType: "selectImg" | "initImg";

	@Input()
	public set navigation(v: TabbarModel) {
		this.tbsvs.tabbarModel = v;
	}
	public get navigation(): TabbarModel {
		return this.tbsvs.tabbarModel;
	}

	constructor(public tbsvs: TabBarSiteViewService, private readonly imageGalleryService: ImageGalleryService) {}

	ngOnInit() {}

	ngOnDestroy() {}

	/**
	 * 点击弹窗选择图片组件
	 */
	public showImageGallery(data: any, type: "selectImg" | "initImg"): void {
		this.currentNavImageData = data;
		this.currentNavType = type;
		this.imageGalleryService.open({
			selectType: "radio",
			nzOk: (data: ImageModel) => {
				this.currentNavImageData[this.currentNavType] = data.url;
			}
		});
	}
}
