import { Component, OnInit, OnDestroy } from "@angular/core";
import { PanelInfoModel, TransformMatrixModel, TrackModel } from "../model";
import { PanelExtendService } from "../panel-extend.service";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { TabBarViewService } from "../panel-widget/all-widget-unit/tab-bar-view/tab-bar-view.service";
import { AppDataService } from "../../appdata/appdata.service";
import { PanelWidgetModel } from "../panel-widget/model";
import { PanelWidgetDetailsSiteService } from "../panel-widget-details/panel-widget-details.service";
import { Subscription } from "rxjs";
import { TabbarModel } from "../panel-widget/all-widget-unit/tab-bar-view/tab-bar-site-view/model";
import { NavigationBarViewService } from "../panel-widget/all-widget-unit/navigation-bar-view/navigation-bar-view.service";
import { PanelSeniorVesselEditService } from "../panel-senior-vessel-edit/panel-senior-vessel-edit.service";
import { VesselWidgetModel, VesselStatusCollectionModel } from "../panel-senior-vessel-edit/model";
import { PanelScaleplateService } from "../panel-scaleplate/panel-scaleplate.service";

@Component({
    selector: "app-panel-shell",
    templateUrl: "./panel-shell.component.html",
    styleUrls: ["./panel-shell.component.scss"],
})
export class PanelShellComponent implements OnInit, OnDestroy {
    // 订阅页面的变化
    private pageChangeRX$: Subscription;
    // 订阅页面内容详情数据
    private appDataRX$: Subscription;

    public get panelInfo(): PanelInfoModel {
        return this.panelExtendService.panelInfoModel;
    }
    public get transform(): TransformMatrixModel {
        return this.panelExtendService.transformMatrixModel;
    }
    // 是否显示底部导航
    public get isShowTabbar(): boolean {
        return this.tabBarViewService.isShowTabbar$.value;
    }
    // 底部导航数据
    public get tabbarModel(): PanelWidgetModel {
        return this.tabBarViewService.tabbarWidgetModel;
    }
    // 滚动条数据
    public get trackModel(): TrackModel {
        return this.panelExtendService.trackModel;
    }

    // 是否进入动态容器编辑模式
    public get isEnterEditVesselCondition(): boolean {
        return this.panelSeniorVesselEditService.isEnterEditVesselCondition$.value;
    }

    // 获取当前动态容器的宽高数据
    public get currentVesselWidgetSize(): { height: string; width: string } {
        return this.panelSeniorVesselEditService.sendVesselHeightWidget();
    }

    // 获取当前正处于动态容器编辑模式下的vessel组件数据
    public get currentVesselWidget(): VesselWidgetModel {
        return this.panelSeniorVesselEditService.vesselWidgetModel$.value;
    }
    // 获取当前动态容器状态的信息
    public get currentVesselStatusInfo(): VesselStatusCollectionModel {
        return this.panelSeniorVesselEditService.currentStatusInVesselInfo;
    }

    constructor(
        private readonly panelExtendService: PanelExtendService,
        private readonly navigationBarViewService: NavigationBarViewService,
        private readonly appDataService: AppDataService,
        private readonly panelWidgetDetailsSiteService: PanelWidgetDetailsSiteService,
        private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService,
        private readonly panelScaleplateService: PanelScaleplateService,
        private readonly tabBarViewService: TabBarViewService
    ) {
        this.pageChangeRX$ = this.appDataService.currentPageData$.subscribe(value => {
            // 先重置标题栏颜色
            this.navigationBarViewService.initNavigationWidget();
            this.tabBarViewService.isShowTabbar$.next(false);
            const _current_customfeature = this.appDataService.currentAppDataForinPageData.customfeature;
            if (_current_customfeature) {
                if (_current_customfeature.isHasTabbar == true) {
                    this.acceptTabbarWidgetStatus();
                }
                // 同时设置当前页面的标题拦颜色数据
                this.navigationBarViewService
                    .setFrontColor(_current_customfeature.navFrontColor)
                    .setBgColor(_current_customfeature.navBgColor)
                    .setNavigationWidgetSiteData();
                // 同时设置当前页面的背景色
                this.panelInfo.bgColor = _current_customfeature.bgColor;
                // 同事设置当前页面的高度
                this.panelInfo.height = _current_customfeature.pageHeight;
            }
        });
        this.appDataRX$ = this.appDataService.launchAppData$.subscribe(app => {
            // 获取接口返回的底部导航数据并赋值
            // 如果接口没有底部导航数据则自动默认生成一个
            if (app) {
                const tabbarWidget = app.app_config && app.app_config.tabbarWidget;
                if (tabbarWidget) {
                    const _tabbar_model = tabbarWidget.content && tabbarWidget.content.tabbarModel;
                    if (_tabbar_model) {
                        this.tabBarViewService.setTabbarWidgetData(new TabbarModel(_tabbar_model));
                    }
                } else {
                    this.tabBarViewService.setTabbarWidgetData(new TabbarModel());
                }
                // 得到接口数据之后设置底部导航数据在app_config里
                this.appDataService.setAppConfigData("tabbarWidget", this.tabbarModel.autoWidget);
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.pageChangeRX$) this.pageChangeRX$.unsubscribe();
        if (this.appDataRX$) this.appDataRX$.unsubscribe();
    }

    /**
     * 接受拖动调节自由面板高度的draggable事件
     */
    public acceptPanelShellDrapDrop(drag: DraggablePort): void {
        if (drag) {
            this.panelInfo.isChangeHeightNow = true;
            this.panelInfo.height += drag.top;
            if (this.panelInfo.height < 736) {
                this.panelInfo.height = 736;
            } else {
                this.transform.translateY += Math.round(drag.top / 1.8);
                this.handleCalcTrackData(drag);
            }
            // 同时把该页面的高度记录在AppDataObjectModel里的CustomFeatureable配置项里，记录该页面高度，便于切换不同页面的时候重新取高度值
            this.appDataService.currentAppDataForinPageData.setCustomfeatureData("pageHeight", this.panelInfo.height);
        } else {
            this.panelInfo.isChangeHeightNow = false;
        }
    }

    /**
     * 接收改变动态容器的宽度或高度的变化
     */
    public acceptVesselWidthDrapDrop(drag: DraggablePort, type: "height" | "width"): void {
        if (drag) {
            const _widget = this.panelSeniorVesselEditService.currentEditVesselWidget$.value;
            this.panelInfo.isChangeHeightNow = type == "height" ? true : false;
            _widget.profileModel.setData({
                [type]: _widget.profileModel[type] + drag[type == "height" ? "top" : "left"],
            });
            if (_widget.profileModel[type] < 10) {
                _widget.profileModel.setData({
                    [type]: 10,
                });
            }
        } else {
            this.panelInfo.isChangeHeightNow = false;
        }
    }

    /**
     *  根据屏幕主视图高度的比例计算滚动滑块的高度和位置，使其能在改变面板高度的时候能无限拉长
     */
    public handleCalcTrackData(drag: DraggablePort): void {
        const _panel_rect_height = this.panelExtendService.panelMainEl.nativeElement.clientHeight;
        const _panel_top_bottom_height =
            Math.abs(this.panelInfo.top) + this.panelInfo.height + Math.abs(this.panelInfo.bottom);
        this.trackModel.y.height = (_panel_rect_height / _panel_top_bottom_height) * 100;
        this.trackModel.y.top = 70 - this.trackModel.y.height;
    }

    /**
     * 点击底部导航显示与否的按钮事件
     * 如果没有创建过底部导航则创建，如果创建过则显示已创建过的底部导航,再次点击则隐藏但不清空底部导航，则清楚当前页面在底部导航里的链接数据
     */
    public acceptTabbarWidgetStatus(): void {
        this.tabBarViewService.isShowTabbar$.next(!this.isShowTabbar);
        this.appDataService.currentAppDataForinPageData.customfeature.isHasTabbar = this.isShowTabbar;
    }

    /**
     * 接收背景色变化的回调
     */
    public acceptPanelBgColorChange(value: string): void {
        this.appDataService.currentAppDataForinPageData.setCustomfeatureData("bgColor", value);
    }

    /**
     * 点击底部导航组件显示组件设置
     */
    public acceptTabbarWidgetData(): void {
        this.panelWidgetDetailsSiteService.launchTypeDetailsView$.next({
            type: "tabbar",
            widget: this.tabBarViewService.tabbarWidgetModel,
            title: "底部导航设置",
        });
    }

    /**
     * 点击头部标题组件显示组件设置
     */
    public acceptNavbarWidgetData(): void {
        this.panelWidgetDetailsSiteService.launchTypeDetailsView$.next({
            type: "navigationbar",
            widget: this.navigationBarViewService.navigationPanelSiteWidget,
            title: "标题拦设置",
        });
    }
}
