import { Component, OnInit } from "@angular/core";
import { Subscription, BehaviorSubject } from "rxjs";
import { PanelScopeEnchantmentService } from "../../panel-scope-enchantment/panel-scope-enchantment.service";
import { TapVesselStatusHandler } from "../event-handler";
import { PanelEventService } from "../panel-event.service";
import { EnumEventHandler } from "../model";
import { SelectVesselStatusOptions } from "./model";
import { PanelSeniorVesselEditService } from "app/panel-extend/panel-senior-vessel-edit/panel-senior-vessel-edit.service";

@Component({
    selector: "app-tap-vessel-to-status-handler",
    templateUrl: "./tap-vessel-to-status-handler.component.html",
    styleUrls: ["./tap-vessel-to-status-handler.component.scss"],
})
export class TapVesselToStatusHandlerComponent implements OnInit {
    private isShowEventSite$: Subscription;
    private tabsetIndexChangeRX$: Subscription;

    // 下拉框选项的数据列表
    public selectVesselStatusList$: BehaviorSubject<SelectVesselStatusOptions[]> = new BehaviorSubject([]);
    // 当前要切换的状态数据模型
    public currentVesselStatusHandler: TapVesselStatusHandler = new TapVesselStatusHandler();
    // 当前动态容器编辑模式下的当前状态（该状态下不可再次切换）
    public get currentStatusId(): string {
        return this.panelSeniorVesselEditService.vesselWidgetModel$.value.currentStatusId;
    }

    constructor(
        private readonly panelEventService: PanelEventService,
        private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService
    ) {
        this.isShowEventSite$ = this.panelEventService.eventSiteModel.isVisibleModal$.subscribe(b => {
            if (b == true) {
                const _inset_widget = this.panelEventService.currentPanelWidgetModel;
                if (_inset_widget) {
                    this.handleSelectVesselStatusListData();
                    // 如果链接是跳转页面则显示页面router
                    const _auto_event = _inset_widget.panelEventHandlerModel;
                    if (_auto_event && _auto_event.eventHandler == "tapVesselStatusHandler") {
                        this.panelEventService.launchCurrentEventIndex$.next(
                            EnumEventHandler[_auto_event.eventHandler]
                        );
                        this.currentVesselStatusHandler.toStatusId = _auto_event.eventParams.to_status_id;
                    }
                }
            } else {
                this.currentVesselStatusHandler = new TapVesselStatusHandler();
            }
        });
        this.tabsetIndexChangeRX$ = this.panelEventService.launchCurrentEventIndex$.subscribe((value: number) => {
            if (EnumEventHandler[value] == "tapVesselStatusHandler") {
                this.panelEventService.eventSiteModel.currentEventModel$.next(this.currentVesselStatusHandler);
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.isShowEventSite$) this.isShowEventSite$.unsubscribe();
        if (this.tabsetIndexChangeRX$) this.tabsetIndexChangeRX$.unsubscribe();
    }

    public handleSelectVesselStatusListData(): void {
        let _cata = this.panelSeniorVesselEditService.vesselWidgetModel$.value.statusWarehouseCollection;
        let _resu_arr = [];
        if (Array.isArray(_cata)) {
            _cata.forEach(_e => {
                _resu_arr.push(new SelectVesselStatusOptions({ name: _e.name, statusId: _e.uniqueId }));
            });
            this.selectVesselStatusList$.next(_resu_arr);
        }
    }

    /**
     * 当选择框打开时计算页面数据
     */
    public acceptSelectOpenChange(isO: boolean): void {
        if (isO == true) {
            this.handleSelectVesselStatusListData();
        }
    }
}
