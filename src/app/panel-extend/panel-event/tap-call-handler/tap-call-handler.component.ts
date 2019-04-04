import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { TapCallHandler } from "../event-handler";
import { PanelEventService } from "../panel-event.service";
import { EnumEventHandler } from "../model";

@Component({
	selector: "app-tap-call-handler",
	templateUrl: "./tap-call-handler.component.html",
	styleUrls: ["./tap-call-handler.component.scss"]
})
export class TapCallHandlerComponent implements OnInit, OnDestroy {
	private isShowEventSite$: Subscription;
	private tabsetIndexChangeRX$: Subscription;

	// 拨打电话号码的数据模型
	public currentTapCallHandler: TapCallHandler = new TapCallHandler();

	constructor(private readonly panelEventService: PanelEventService) {
		this.isShowEventSite$ = this.panelEventService.eventSiteModel.isVisibleModal$.subscribe(b => {
			if (b == true) {
				const _inset_widget = this.panelEventService.currentPanelWidgetModel;
				if (_inset_widget) {
					// 如果链接是拨打电话则显示电话号码
					const _auto_event = _inset_widget.panelEventHandlerModel;
					if (_auto_event && _auto_event.eventHandler == "tapCallHandler") {
						this.panelEventService.launchCurrentEventIndex$.next(
							EnumEventHandler[_auto_event.eventHandler]
						);
						this.currentTapCallHandler.setPhoneNum(_auto_event.eventParams.phone_num);
					}
				}
			} else {
				this.currentTapCallHandler = new TapCallHandler();
			}
		});
		this.tabsetIndexChangeRX$ = this.panelEventService.launchCurrentEventIndex$.subscribe((value: number) => {
			if (EnumEventHandler[value] == "tapCallHandler") {
				this.panelEventService.eventSiteModel.currentEventModel$.next(this.currentTapCallHandler);
			}
		});
	}

	ngOnInit() {}
	ngOnDestroy() {
		if (this.isShowEventSite$) this.isShowEventSite$.unsubscribe();
		if (this.tabsetIndexChangeRX$) this.tabsetIndexChangeRX$.unsubscribe();
	}
}
