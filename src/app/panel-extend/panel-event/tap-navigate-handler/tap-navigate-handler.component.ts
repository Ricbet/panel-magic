import { Component, OnInit, OnDestroy } from "@angular/core";
import { AppDataService } from "../../../appdata/appdata.service";
import { Subscription, BehaviorSubject } from "rxjs";
import { TapNavigateHandler } from "../event-handler";
import { PanelEventService } from "../panel-event.service";
import { EnumEventHandler } from "../model";
import { RouterPageOption } from "./model";

@Component({
    selector: "app-tap-navigate-handler",
    templateUrl: "./tap-navigate-handler.component.html",
    styleUrls: ["./tap-navigate-handler.component.scss"],
})
export class TapNavigateHandlerComponent implements OnInit, OnDestroy {
    private isShowEventSite$: Subscription;
    private tabsetIndexChangeRX$: Subscription;

    // 下拉框选项的数据列表
    public pageRouterList$: BehaviorSubject<RouterPageOption[]> = new BehaviorSubject([]);
    // 当前要跳转的路由数据模型
    public currentTapNavigateHandler: TapNavigateHandler = new TapNavigateHandler();

    constructor(
        private readonly appDataService: AppDataService,
        private readonly panelEventService: PanelEventService
    ) {
        this.isShowEventSite$ = this.panelEventService.eventSiteModel.isVisibleModal$.subscribe(b => {
            if (b == true) {
                const _inset_widget = this.panelEventService.currentPanelWidgetModel;
                if (_inset_widget) {
                    this.handlePageRouterListData();
                    // 如果链接是跳转页面则显示页面router
                    const _auto_event = _inset_widget.panelEventHandlerModel;
                    if (_auto_event && _auto_event.eventHandler == "tapNavigateHandler") {
                        this.panelEventService.launchCurrentEventIndex$.next(
                            EnumEventHandler[_auto_event.eventHandler]
                        );
                        this.currentTapNavigateHandler.navUrl = _auto_event.eventParams.nav_url;
                    }
                }
            } else {
                this.currentTapNavigateHandler = new TapNavigateHandler();
            }
        });
        this.tabsetIndexChangeRX$ = this.panelEventService.launchCurrentEventIndex$.subscribe((value: number) => {
            if (EnumEventHandler[value] == "tapNavigateHandler") {
                this.panelEventService.eventSiteModel.currentEventModel$.next(this.currentTapNavigateHandler);
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.isShowEventSite$) this.isShowEventSite$.unsubscribe();
        if (this.tabsetIndexChangeRX$) this.tabsetIndexChangeRX$.unsubscribe();
    }

    public handlePageRouterListData(): void {
        let _cata = this.appDataService.appDataModel.cata_data;
        let _resu_arr = [];
        if (Array.isArray(_cata)) {
            _cata.forEach(_e => {
                _resu_arr.push(new RouterPageOption({ name: _e.group, router: "-1", isCata: true }));
                if (_e.pages && Array.isArray(_e.pages)) {
                    _e.pages.forEach(_page => {
                        _resu_arr.push(
                            new RouterPageOption({ router: _page["router"], name: _page["name"], isCata: false })
                        );
                    });
                }
            });
            this.pageRouterList$.next(_resu_arr);
        }
    }

    /**
     * 当选择框打开时计算页面数据
     */
    public acceptSelectOpenChange(isO: boolean): void {
        if (isO == true) {
            this.handlePageRouterListData();
        }
    }
}
