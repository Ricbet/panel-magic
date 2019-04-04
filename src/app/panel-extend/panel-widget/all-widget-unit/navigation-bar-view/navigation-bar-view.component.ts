import { Component, OnInit, OnDestroy } from "@angular/core";
import { interval, Subscription } from "rxjs";
import { AppDataService } from "app/appdata/appdata.service";
import { AppDataObjectModel } from "app/appdata";
import { NavigationBarViewService } from "./navigation-bar-view.service";
import { NavigationBarModel } from "./navigation-bar-site-view/model";

@Component({
	selector: "app-navigation-bar-view",
	templateUrl: "./navigation-bar-view.component.html",
	styleUrls: ["./navigation-bar-view.component.scss"]
})
export class NavigationBarViewComponent implements OnInit, OnDestroy {
	// 订阅轮训时间
	private intervalTimeRX$: Subscription;
	// 当前时间（时：分）
	public currentNowDate: number = 0;

	// 当前页面信息
	public get currentPageInfo(): AppDataObjectModel {
		return this.appDataService.currentAppDataForinPageData;
	}

	public get navigationWidgetModel(): NavigationBarModel {
		return this.navigationBarViewService.navigationWidgetModel;
	}

	constructor(
		private readonly appDataService: AppDataService,
		private readonly navigationBarViewService: NavigationBarViewService
	) {}

	ngOnInit() {
		// 每隔一秒轮训计算当前时间
		this.intervalTimeRX$ = interval(1000).subscribe(() => {
			this.currentNowDate = Date.now();
		});
	}

	ngOnDestroy() {
		if (this.intervalTimeRX$) this.intervalTimeRX$.unsubscribe();
	}
}
