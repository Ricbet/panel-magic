import { Component, OnInit, OnDestroy } from "@angular/core";
import { PanelSeniorVesselEditService } from "./panel-senior-vessel-edit.service";
import { Subscription, BehaviorSubject } from "rxjs";
import { PanelWidgetModel } from "../panel-widget/model";
import { PanelExtendService } from "../panel-extend.service";
import { PanelInfoModel } from "../model";
import { cloneDeep } from "lodash";
import { debounceTime } from "rxjs/operators";
import { get } from "lodash";
import { VesselWidgetModel } from "./model";
import { PanelScopeEnchantmentService } from "../panel-scope-enchantment/panel-scope-enchantment.service";
import { AppDataService } from "app/appdata/appdata.service";
import { PanelScaleplateService } from "../panel-scaleplate/panel-scaleplate.service";
import { PanelExtendMoveBackService } from "../panel-extend-move-back.service";

@Component({
    selector: "app-panel-senior-vessel-edit",
    templateUrl: "./panel-senior-vessel-edit.component.html",
    styleUrls: ["./panel-senior-vessel-edit.component.scss"],
})
export class PanelSeniorVesselEditComponent implements OnInit, OnDestroy {
    // 订阅选中的动态容器组件
    private vesselModelRX$: Subscription;
    // 订阅主视图屏幕滚动变化（重新计算动态容器组件的位置）
    private transformMatrixRX$: Subscription;
    // 订阅widgetList集合，拦截操作，使其原本的一切操作都在该动态容器之上
    private widgetListRX$: Subscription;
    // 订阅当前选中的状态
    private currentStatusRX$: Subscription;
    public get isEnterEditVesselCondition(): boolean {
        return this.panelSeniorVesselEditService.isEnterEditVesselCondition$.value;
    }

    public get currentEditVesselWidget(): PanelWidgetModel {
        return this.panelSeniorVesselEditService.currentEditVesselWidget$.value;
    }

    public get panelInfoModel(): PanelInfoModel {
        return this.panelExtendService.panelInfoModel;
    }

    public get vesselWidgetModel$(): BehaviorSubject<VesselWidgetModel> {
        return this.panelSeniorVesselEditService.vesselWidgetModel$;
    }

    public get riverDiversionWidgetList(): PanelWidgetModel[] {
        return this.panelSeniorVesselEditService.riverDiversionWidgetList$.value;
    }

    // 返回当前被选动态容器组件的样式
    public vesselStyle: { [key: string]: string } = {};

    constructor(
        private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
        private readonly panelScaleplateService: PanelScaleplateService,
        private readonly panelExtendMoveBackService: PanelExtendMoveBackService,
        private readonly appDataService: AppDataService,
        private readonly panelExtendService: PanelExtendService
    ) {
        this.vesselModelRX$ = this.panelSeniorVesselEditService.currentEditVesselWidget$.subscribe(widget => {
            if (widget) {
                // 先记录原本页面视图的固定值、方便恢复
                this.panelInfoModel.recordImmobilizationData();
                // 使视图回到中心位置
                this.panelScaleplateService.launchOrigin$.next();
                // 先取消轮廓的选中效果
                this.panelScopeEnchantmentService.scopeEnchantmentModel.emptyAllProfile();
                // 同时把该容器的vesselModel数据映射在服务里
                this.handleMappingVesselModalData(widget);
                // 同时判断是否有状态列表，若一个都没有则默认新添加一个空的状态1列表
                this.handleNoneStatusListInit();
                // 同时修改panelInfoModel数据的宽高为当前动态容器的宽高;
                setTimeout(() => {
                    this.panelExtendService.launchRecordPanelInfoRect$.next();
                });
            }
            // 采用css3属性，处理四周的动画效果
            this.handleAnimationAllRound();
        });
        this.widgetListRX$ = this.panelSeniorVesselEditService.riverDiversionWidgetList$.subscribe(list => {
            const currentStatus = this.panelSeniorVesselEditService.currentStatusInVesselInfo;
            if (list && currentStatus && this.isEnterEditVesselCondition) {
                // 将引流进来的widget数据集存放在当前状态下
                currentStatus.widgetList = this.panelExtendService.handleSaveWidgetToOrientationModelData(list);
            }
        });
        this.currentStatusRX$ = this.panelSeniorVesselEditService.launchCurrentStatusIdChange$
            .pipe(debounceTime(1))
            .subscribe(() => {
                const currentStatus = this.panelSeniorVesselEditService.currentStatusInVesselInfo;
                if (currentStatus && this.isEnterEditVesselCondition) {
                    this.panelScopeEnchantmentService.scopeEnchantmentModel.emptyAllProfile();
                    this.panelExtendService.nextWidgetList(
                        this.panelExtendService.handleFreeItemToPanelWidget(currentStatus.widgetList)
                    );
                    // 将该动态容器的状态的数据记录在DB里（不同状态开辟一张表）
                    this.panelExtendMoveBackService.createCollections(currentStatus.uniqueId).subscribe(b => {
                        if (b) this.panelExtendService.launchSaveIndexedDB$.next();
                    });
                }
            });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.vesselModelRX$) this.vesselModelRX$.unsubscribe();
        if (this.transformMatrixRX$) this.transformMatrixRX$.unsubscribe();
        if (this.widgetListRX$) this.widgetListRX$.unsubscribe();
        if (this.currentStatusRX$) this.currentStatusRX$.unsubscribe();
    }

    /**
     * 点击退出动态容器编辑模式
     * 退出的同时保存当前动态容器的数据
     * 同时恢复图层为页面的widgetlist
     */
    public acceptExitRoomVessel(): void {
        // 退出编辑模式的时候恢复panelInfo数据
        this.panelInfoModel.setData(<DOMRect>{ ...this.panelInfoModel.immobilizationData });
        this.panelScopeEnchantmentService.scopeEnchantmentModel.emptyAllProfile();
        this.saveVesselWidgetData();
        this.panelSeniorVesselEditService.isEnterEditVesselCondition$.next(false);
        this.panelExtendService.nextWidgetList(this.panelExtendService.widgetList$.value);
        this.panelSeniorVesselEditService.currentEditVesselWidget$.next(null);
        // 退出编辑模式的时候切换当前页面的DB数据
        this.panelExtendMoveBackService
            .createCollections(this.appDataService.currentAppDataForinPageData.router)
            .subscribe(b => {
                if (b) this.panelExtendService.launchSaveIndexedDB$.next();
            });
    }

    /**
     * 保存当前动态容器的状态
     */
    public saveVesselWidgetData(): void {
        const currentStatus = this.panelSeniorVesselEditService.currentStatusInVesselInfo;
        const vesselWidget = get(this.currentEditVesselWidget, "autoWidget.content.vesselWidget");
        if (vesselWidget) {
            currentStatus.widgetList = this.panelExtendService.handleSaveWidgetToOrientationModelData(
                this.riverDiversionWidgetList
            );
            this.currentEditVesselWidget.autoWidget.content.vesselWidget = cloneDeep(
                this.panelSeniorVesselEditService.vesselWidgetModel$.value
            );
            console.log(this.currentEditVesselWidget, "currentEditVesselWidget");
        }
    }

    /**
     * 处理映射关系，使得当前正在编辑的动态容器的vessel数据转移在服务里
     */
    public handleMappingVesselModalData(widget: PanelWidgetModel): void {
        const vesselWidget = get(widget, "autoWidget.content.vesselWidget");
        if (vesselWidget) {
            this.panelSeniorVesselEditService.vesselWidgetModel$.next(vesselWidget);
        }
    }

    /**
     * 默认设置一个状态列表，（仅限没有状态列表的情况）
     */
    public handleNoneStatusListInit(): void {
        const statusList = get(
            this.currentEditVesselWidget,
            "autoWidget.content.vesselWidget.statusWarehouseCollection"
        );
        const vessel = this.vesselWidgetModel$.value;
        if (statusList && Array.isArray(statusList) && statusList.length == 0) {
            vessel.addNewStatusCollection("状态 1");
            // 同时默认选中第一个状态;
            vessel.currentStatusId = vessel.statusWarehouseCollection[0].uniqueId;
            this.panelSeniorVesselEditService.launchCurrentStatusIdChange$.next(vessel.currentStatusId);
        } else {
            this.handleLaunchFirstStatus();
        }
    }

    /**
     * 若有状态列表则默认选中
     */
    public handleLaunchFirstStatus(): void {
        const currentStatus = this.panelSeniorVesselEditService.currentStatusInVesselInfo;
        if (currentStatus) {
            this.panelSeniorVesselEditService.launchCurrentStatusIdChange$.next(currentStatus.uniqueId);
        }
    }

    /**
     * 处理四周动画效果
     */
    public handleAnimationAllRound(): void {
        const left = document.querySelector("#panel-left");
        const right = document.querySelector("#panel-right");
        const top = document.querySelector("#panel-top");
        const common = document.querySelector("#panel-common");
        const commonRight = document.querySelector("#panel-common-right");
        if (left && right && top) {
            left.classList.add("leftnav-show");
            right.classList.add("rightnav-show");
            top.classList.add("toolbar-show");
            common.classList.add("common-show");
            commonRight.classList.add("common-show");
            setTimeout(() => {
                left.classList.remove("leftnav-show");
                right.classList.remove("rightnav-show");
                top.classList.remove("toolbar-show");
                common.classList.remove("common-show");
                commonRight.classList.remove("common-show");
            }, 1000);
        }
    }
}
