import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { PanelEventService } from "./panel-event.service";
import { Subscription, BehaviorSubject } from "rxjs";
import { PanelScopeEnchantmentService } from "../panel-scope-enchantment/panel-scope-enchantment.service";
import { OuterSphereHasAuxlModel } from "../panel-scope-enchantment/model";
import { EntranceModel } from "./model";
import { EventSiteModel } from "./model/event-site.model";
import { PanelExtendService } from "../panel-extend.service";
import { NzTabComponent } from "ng-zorro-antd";
import { panelWidgetComponentObj } from "../panel-widget/all-widget-container";
import { PanelWidgetModel } from "../panel-widget/model";
import { PanelSeniorVesselEditService } from "../panel-senior-vessel-edit/panel-senior-vessel-edit.service";
import { EventModel } from "./event-handler";

@Component({
    selector: "app-panel-event",
    templateUrl: "./panel-event.component.html",
    styleUrls: ["./panel-event.component.scss"],
})
export class PanelEventComponent implements OnInit, OnDestroy {
    @Input()
    public set panelWidgetModel(v: PanelWidgetModel) {
        this.panelEventService.currentPanelWidgetModel = v;
    }
    // 订阅主轮廓的显示
    private profileOutershpereRX$: Subscription;
    // 订阅轮廓值的变化
    private profileOutershpereValueChangeRX$: Subscription;
    // 订阅开启链接设置的变化
    private openEventSiteRX$: Subscription;
    // 控制tiptop提示语显示与否
    public isVisibleToolTip: boolean = false;
    // 控制事件信息气泡卡片的显示与否
    public isVisiblePopoverEventInfo: boolean = false;
    public get entranceModel(): EntranceModel {
        return this.panelEventService.entranceModel;
    }
    public get eventSiteModel(): EventSiteModel {
        return this.panelEventService.eventSiteModel;
    }
    public get launchCurrentEventIndex$(): BehaviorSubject<number> {
        return this.panelEventService.launchCurrentEventIndex$;
    }
    public get currentWidgetHasEvent$(): BehaviorSubject<PanelWidgetModel> {
        return this.panelEventService.currentWidgetHasEvent$;
    }
    public get isEnterEditVesselCondition(): boolean {
        return this.panelSeniorVesselEditService.isEnterEditVesselCondition$.value;
    }
    public get currentWidgetHasEventHandler(): EventModel {
        return this.panelEventService.currentWidgetHasEventHandler;
    }

    constructor(
        private readonly panelEventService: PanelEventService,
        private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService
    ) {
        // 仅支持选中一个组件设置链接事件
        this.profileOutershpereRX$ = this.panelScopeEnchantmentService.scopeEnchantmentModel.profileOuterSphere$.subscribe(
            outer => {
                const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel
                    .outerSphereInsetWidgetList$.value;
                // 只有普通组件以及组合才有事件链接
                const _widget_container_list = panelWidgetComponentObj;
                if (
                    outer &&
                    Array.isArray(_inset_widget) &&
                    _inset_widget.length == 1 &&
                    (_widget_container_list[_inset_widget[0].type] || _inset_widget[0].type == "combination")
                ) {
                    this.entranceModel.isShow$.next(true);
                    this.handleWidgetAutoEventHandler(_inset_widget[0]);
                    this.handleCalcEntrancePosition(outer);
                    this.profileOutershpereValueChangeRX$ = outer.valueChange$
                        .pipe()
                        .subscribe((value: OuterSphereHasAuxlModel) => {
                            this.handleCalcEntrancePosition(value);
                        });
                } else {
                    if (this.profileOutershpereValueChangeRX$) this.profileOutershpereValueChangeRX$.unsubscribe();
                    this.entranceModel.isShow$.next(false);
                    this.eventSiteModel.isVisibleModal$.next(false);
                }
            }
        );
        this.openEventSiteRX$ = this.panelEventService.eventSiteModel.isVisibleModal$.subscribe(() => {});
    }

    ngOnInit() {}
    ngOnDestroy() {
        if (this.profileOutershpereRX$) this.profileOutershpereRX$.unsubscribe();
        if (this.profileOutershpereValueChangeRX$) this.profileOutershpereValueChangeRX$.unsubscribe();
        if (this.openEventSiteRX$) this.openEventSiteRX$.unsubscribe();
    }

    /**
     * 计算入口图标位置
     */
    public handleCalcEntrancePosition(value: OuterSphereHasAuxlModel): void {
        if (value) {
            const _offset_left = this.panelScopeEnchantmentService.handleOuterSphereRotateOffsetCoord(value).left || 0;
            this.entranceModel.setData({
                left: value.left + value.width + 10 - _offset_left,
                top: value.top + value.height / 2 - 13,
            });
            this.eventSiteModel.setPosition({
                left: value.left + value.width + 66 - _offset_left,
                top: value.top + value.height / 2 - 25,
            });
        }
    }

    /**
     * 生成主轮廓的时候判断所有被选的组件是否有设置链接事件，有的话则默认显示链接事件
     */
    public handleWidgetAutoEventHandler(currentWidget: PanelWidgetModel): void {
        if (currentWidget) {
            const _auto_event = currentWidget.panelEventHandlerModel;
            if ((<Object>_auto_event).hasOwnProperty("eventHandler") && _auto_event.eventHandler) {
                this.currentWidgetHasEvent$.next(currentWidget);
            } else {
                this.currentWidgetHasEvent$.next(null);
            }
        }
    }

    /**
     * 接收链接设置的点击图标触发链接设置窗口
     */
    public acceptEventEntrance(): void {
        this.isVisibleToolTip = false;
        this.panelEventService.openEventEntranceSite();
    }

    /**
     * 接收标签页头部选项变化的回调
     */
    public acceptTabsetChange(data: { index: number; tab: NzTabComponent }): void {
        this.launchCurrentEventIndex$.next(data.index);
    }

    /**
     * 关闭事件弹窗
     */
    public closeEventModal(): void {
        this.eventSiteModel.isVisibleModal$.next(false);
        this.launchCurrentEventIndex$.next(0);
    }

    /**
     * 点击确定设置当前组件的事件
     */
    public acceptEventOkSite(): void {
        if (this.panelEventService.currentPanelWidgetModel) {
            this.panelEventService.currentPanelWidgetModel.panelEventHandlerModel = this.eventSiteModel.currentEventModel$.value;
            this.panelEventService.currentPanelWidgetModel.autoWidget.customfeature = this.eventSiteModel.currentEventModel$.value.autoWidgetEvent;
            this.closeEventModal();
            this.handleWidgetAutoEventHandler(this.panelEventService.currentPanelWidgetModel);
        }
    }

    /**
     * 点击修改选中组件的事件
     */
    public modifyChangeEvent(): void {
        this.isVisiblePopoverEventInfo = false;
        this.panelEventService.eventSiteModel.isVisibleModal$.next(true);
        this.eventSiteModel.currentEventModel$.next(
            this.panelEventService.currentPanelWidgetModel.panelEventHandlerModel
        );
    }

    /**
     * 删除当前选中组件的事件
     */
    public delCurrentEvent(): void {
        this.isVisiblePopoverEventInfo = false;
        this.panelEventService.currentPanelWidgetModel.panelEventHandlerModel.reset();
        this.handleWidgetAutoEventHandler(this.panelEventService.currentPanelWidgetModel);
    }
}
