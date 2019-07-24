import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from "@angular/core";
import { PanelWidgetAppearanceService } from "./panel-widget-appearance.service";
import { AppearanceModel, ConventionSiteModel, alignType } from "./model";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { Subscription, BehaviorSubject } from "rxjs";
import { PanelScopeEnchantmentService } from "../panel-scope-enchantment/panel-scope-enchantment.service";
import { ProfileModel, OuterSphereHasAuxlModel, ScopeEnchantmentModel } from "../panel-scope-enchantment/model";
import { PanelWidgetModel } from "../panel-widget/model";
import { PanelExtendService } from "../panel-extend.service";
import { distinctUntilChanged, auditTime } from "rxjs/operators";
import { panelSiteComponentObj } from "../panel-widget-appearance-site";
import { cloneDeep } from "lodash";
import { PanelWidgetDetailsSiteService } from "../panel-widget-details/panel-widget-details.service";

@Component({
    selector: "app-panel-widget-appearance",
    templateUrl: "./panel-widget-appearance.component.html",
    styleUrls: ["./panel-widget-appearance.component.scss"],
})
export class PanelWidgetAppearanceComponent implements OnInit {
    // 主轮廓的可订阅对象
    public profileOuterSphereRX$: Subscription;
    // 主轮廓样式的值的变化可订阅对象
    private profileValueChangeRX$: Subscription;
    // 外观设置显示与否的可订阅对象
    private appearanceIsShowRX$: Subscription;
    // 订阅对齐方式
    private alignWayRX$: Subscription;
    public currentComponentRef: ComponentRef<any>;

    // 是否允许设置水平等间距或垂直等间距
    public get isEqualDistanceSet(): boolean {
        return this.scopeEnchantment.outerSphereInsetWidgetList$.value.length > 2;
    }
    public get appearance(): AppearanceModel {
        return this.panelWidgetAppearanceService.appearanceModel;
    }
    public get conventionSite(): ConventionSiteModel {
        return this.panelWidgetAppearanceService.conventionSiteModel$.value;
    }
    public get scopeEnchantment(): ScopeEnchantmentModel {
        return this.panelScopeEnchantmentService.scopeEnchantmentModel;
    }
    public get insetWidgetList(): Array<PanelWidgetModel> {
        return this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
    }
    public get isOpenAnimation$(): BehaviorSubject<boolean> {
        return this.panelWidgetAppearanceService.isOpenAnimation$;
    }
    public get isOpenRotate$(): BehaviorSubject<boolean> {
        return this.panelWidgetAppearanceService.isOpenRotate$;
    }
    public get isOpenOpacity$(): BehaviorSubject<boolean> {
        return this.panelWidgetAppearanceService.isOpenOpacity$;
    }
    public get isOpenOtherSite$(): BehaviorSubject<boolean> {
        return this.panelWidgetAppearanceService.isOpenOtherSite$;
    }
    public get isOpenWidth$(): BehaviorSubject<boolean> {
        return this.panelWidgetAppearanceService.isOpenWidth$;
    }
    public get isOpenHeight$(): BehaviorSubject<boolean> {
        return this.panelWidgetAppearanceService.isOpenHeight$;
    }

    @ViewChild("otherSiteContainer", { read: ViewContainerRef, static: false })
    public otherSiteContainer: ViewContainerRef;

    constructor(
        private readonly componentFactoryResolver: ComponentFactoryResolver,
        private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService,
        private readonly panelWidgetDetailsSiteService: PanelWidgetDetailsSiteService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
        private readonly panelExtendService: PanelExtendService
    ) {
        this.profileOuterSphereRX$ = this.scopeEnchantment.profileOuterSphere$
            .pipe(distinctUntilChanged())
            .subscribe(value => {
                if (value) {
                    this.appearance.isShow$.next(true);
                    const insetWidget = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
                    if (Array.isArray(insetWidget) && insetWidget.length == 1) {
                        this.handleSetOnlyWidget();
                    } else if (Array.isArray(insetWidget) && insetWidget.length > 1) {
                        this.handleSetMoreWidget();
                        this.isOpenAnimation$.next(false);
                    }
                    this.subPruOuterSphereValueChange(value);
                } else {
                    this.appearance.isShow$.next(false);
                    if (this.profileValueChangeRX$) this.profileValueChangeRX$.unsubscribe();
                }
            });

        this.appearanceIsShowRX$ = this.panelWidgetAppearanceService.appearanceModel.isShow$.subscribe(bool => {
            if (bool) {
                setTimeout(() => {
                    if (Array.isArray(this.insetWidgetList) && this.insetWidgetList.length == 1) {
                        const widgetType = this.insetWidgetList[0].type;
                        if (panelSiteComponentObj[widgetType] && this.otherSiteContainer) {
                            if (this.currentComponentRef) this.currentComponentRef.destroy();
                            this.otherSiteContainer.clear();
                            this.currentComponentRef = this.otherSiteContainer.createComponent(
                                this.componentFactoryResolver.resolveComponentFactory(panelSiteComponentObj[widgetType])
                            );
                            this.currentComponentRef.instance.widget = this.insetWidgetList[0];
                        }
                        this.isOpenAnimation$.next(true);
                        this.isOpenRotate$.next(true);
                        this.isOpenOpacity$.next(true);
                        this.isOpenWidth$.next(true);
                        this.isOpenHeight$.next(true);
                    }
                });
            }
        });

        this.alignWayRX$ = this.panelWidgetAppearanceService.launchAlignWay$.subscribe(type => {
            this.alignWay(type);
        });
    }

    ngOnInit() {
        // 根据窗口的大小重新定位外观设置的位置和高度
        this.panelWidgetAppearanceService.appearanceModel.left = window.innerWidth - 490;
        this.panelWidgetAppearanceService.appearanceModel.height = window.innerHeight - this.appearance.top - 10;
    }

    ngOnDestroy() {
        if (this.profileOuterSphereRX$) this.profileOuterSphereRX$.unsubscribe();
        if (this.profileValueChangeRX$) this.profileValueChangeRX$.unsubscribe();
        if (this.appearanceIsShowRX$) this.appearanceIsShowRX$.unsubscribe();
        if (this.currentComponentRef) this.currentComponentRef.destroy();
        if (this.alignWayRX$) this.alignWayRX$.unsubscribe();
    }

    /**
     * 开始订阅主轮廓的值观察对象
     */
    public subPruOuterSphereValueChange(sphere: OuterSphereHasAuxlModel): void {
        if (sphere) {
            if (this.profileValueChangeRX$) this.profileValueChangeRX$.unsubscribe();
            const insetWidget = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
            this.profileValueChangeRX$ = sphere.valueChange$.pipe(auditTime(10)).subscribe(value => {
                if (insetWidget.length == 1) {
                    let conObj = cloneDeep<ProfileModel>(value);
                    this.conventionSite.setData(conObj);
                } else {
                    this.handleSetMoreWidget();
                }
            });
        }
    }

    /**
     * 接收头部拖拽回来的数据
     */
    public acceptDraggableData(data: DraggablePort): void {
        if (data) {
            this.appearance.top += data.top;
            this.appearance.left += data.left;
        }
    }

    /**
     * 隐藏外观设置
     */
    public closeAppearance(): void {
        this.appearance.isShow$.next(false);
    }

    /**
     * 对齐方式
     * 如果主轮廓内的被选组件多余一个时则计算轮廓内的组件
     * 否则只计算唯一的被选组件于主视图屏幕的对齐方式
     * // 对齐之前保存一份到本地DB
     */
    public alignWay(type: alignType): void {
        this.panelExtendService.launchSaveIndexedDB$.next();
        const panelInfo = this.panelExtendService.panelInfoModel;
        const widgetList = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
        const pro = this.scopeEnchantment.valueProfileOuterSphere;
        const calcProfile = (e: PanelWidgetModel, pro: OuterSphereHasAuxlModel | ProfileModel): void => {
            let offsetCoord = { left: 0, top: 0 };
            if (e.profileModel.rotate != 0) {
                offsetCoord = this.panelScopeEnchantmentService.handleOuterSphereRotateOffsetCoord(e.profileModel);
            }
            const config = {
                left: pro.left + offsetCoord.left * -1,
                top: pro.top + offsetCoord.top * -1,
                right: pro.left + pro.width - e.profileModel.width + offsetCoord.left,
                bottom: pro.top + pro.height - e.profileModel.height + offsetCoord.top,
                center: pro.left + pro.width / 2 - e.profileModel.width / 2,
                trancenter: pro.top + pro.height / 2 - e.profileModel.height / 2,
            };
            if (config[type] != undefined) {
                e.profileModel[type == "left" || type == "right" || type == "center" ? "left" : "top"] = config[type];
            }
        };
        const equidistanceFn = (type: "width" | "height") => {
            const allWidget = widgetList.map(e => e.profileModel[type]).reduce((a, b) => a + b);
            // 计算间隙距离
            const spaceBet = (pro[type] - allWidget) / (widgetList.length - 1);
            const sortList = widgetList.sort((a, b) => {
                return (
                    a.profileModel[type == "width" ? "left" : "top"] - b.profileModel[type == "width" ? "left" : "top"]
                );
            });
            sortList.forEach((w, i) => {
                if (i > 0) {
                    w.profileModel[type == "width" ? "left" : "top"] =
                        widgetList[i - 1].profileModel[type == "width" ? "left" : "top"] +
                        widgetList[i - 1].profileModel[type] +
                        spaceBet;
                }
            });
        };
        if (type != "crosswiseEquidistance" && type != "verticalEquidistance") {
            widgetList.forEach(e => {
                calcProfile(
                    e,
                    widgetList.length > 1
                        ? pro
                        : <ProfileModel>{
                              left: 0,
                              width: panelInfo.width,
                              top: 0,
                              height: panelInfo.height,
                          }
                );
            });
        } else if (type == "crosswiseEquidistance") {
            equidistanceFn("width");
        } else if (type == "verticalEquidistance") {
            equidistanceFn("height");
        }

        this.scopeEnchantment.outerSphereInsetWidgetList$.next(widgetList);
        this.panelScopeEnchantmentService.handleFromWidgetListToProfileOuterSphere({ isLaunch: false });
    }

    /**
     * 只选中一个组件的时候设置对应的conventionSiteModel
     */
    public handleSetOnlyWidget(): void {
        const insetWidget = this.scopeEnchantment.outerSphereInsetWidgetList$.value[0];
        if (insetWidget.conventionSiteModel instanceof ConventionSiteModel) {
            const proValue = insetWidget.profileModel;
            insetWidget.conventionSiteModel.setData(cloneDeep(proValue));
            this.panelWidgetAppearanceService.conventionSiteModel$.next(insetWidget.conventionSiteModel);
        }
    }

    /**
     * 选中多个不同的widget组件时判断筛选相同的conventionSite数据
     */
    public handleSetMoreWidget(): void {
        const insetWidget = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
        // 如果选了多个组件则设置统一的样式数据
        this.panelWidgetAppearanceService.conventionSiteModel$.next(new ConventionSiteModel());
        // 同时查询是否所有被选的组件的样式是否有一致的
        let firstP = new ProfileModel();
        firstP.setData(insetWidget[0].profileModel);
        let config: ConventionSiteModel = <ConventionSiteModel>{
            rotate: firstP.rotate,
            left: firstP.left,
            top: firstP.top,
            width: firstP.width,
            height: firstP.height,
            opacity: firstP.opacity,
        };
        insetWidget.forEach(w => {
            ["left", "top", "width", "height", "rotate", "opacity"].forEach(c => {
                if (w.profileModel[c] != firstP[c]) {
                    config[c] = null;
                }
            });
        });
        this.conventionSite.setData(cloneDeep(config));
    }

    /**
     * 接收输入框值的变化
     * 不仅要改变主轮廓的位置变化，也要改变轮廓内被选组件的变化
     */
    public acceptAllValueChange(type: string): void {
        const insetWidget = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
        if (insetWidget.length == 1) {
            this.handleOnlyWidgetStyleContent();
        } else {
            this.handleMoreWidgetStyleContent(type);
        }
    }

    /**
     * 处理只选中一个组件的时候设置主轮廓样式和当前被选的组件样式数据
     */
    public handleOnlyWidgetStyleContent(): void {
        const siteValue = this.conventionSite.valueKeys;
        const pro = this.scopeEnchantment.valueProfileOuterSphere;
        const insetWidget = this.scopeEnchantment.outerSphereInsetWidgetList$.value[0];
        const drag = {
            left: siteValue.left - pro.left,
            top: siteValue.top - pro.top,
        };
        pro.setMouseCoord([pro.left, pro.top]);
        insetWidget.profileModel.setMouseCoord([insetWidget.profileModel.left, insetWidget.profileModel.top]);
        this.scopeEnchantment.handleProfileOuterSphereLocationInsetWidget(drag);
        this.scopeEnchantment.handleLocationInsetWidget(drag);
        pro.setData({
            width: siteValue.width,
            height: siteValue.height,
            rotate: siteValue.rotate,
            opacity: siteValue.opacity,
        });
        // 同时改变被选组件的样式、除了left和top外
        insetWidget.profileModel.setData({
            width: siteValue.width,
            height: siteValue.height,
            rotate: siteValue.rotate,
            opacity: siteValue.opacity,
        });
        insetWidget.addStyleToUltimatelyStyle({
            width: `${siteValue.width}px`,
            height: `${siteValue.height}px`,
            opacity: `${siteValue.opacity / 100}`,
        });
    }

    /**
     * 处理选中多个组件的时候设置主轮廓的样式以及被选组件的轮廓和样式
     */
    public handleMoreWidgetStyleContent(type: string): void {
        const value = this.conventionSite.valueKeys;
        const insetWidget = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
        insetWidget.forEach(e => {
            if (e.profileModel[type] != undefined) {
                e.profileModel[type] = value[type];
                e.addStyleToUltimatelyStyle({
                    width: `${value.width}px`,
                    height: `${value.height}px`,
                    opacity: `${value.opacity / 100}`,
                });
            }
        });
        this.panelScopeEnchantmentService.handleFromWidgetListToProfileOuterSphere({ isLaunch: false });
    }

    /**
     * 只要点击外观设置的界面就取消ctr+a的全选快捷键
     * 同时设置最高层级
     */
    public appearanceDownEvent(): void {
        this.panelWidgetAppearanceService.appearanceModel.zIndex =
            this.panelWidgetDetailsSiteService.detailsModel.zIndex + 1;
    }

    /**
     * 接收底部拖拽拉伸外观设置的高度，最低不能低于240px
     */
    public acceptFooterDraggable(drag: DraggablePort): void {
        if (drag) {
            this.appearance.height += drag.top;
            if (this.appearance.height < 240) {
                this.appearance.height = 240;
            }
        }
    }
}
