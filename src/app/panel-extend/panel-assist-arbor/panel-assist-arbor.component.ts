import { Component, OnInit } from "@angular/core";
import { PanelExtendMoveBackService } from "../panel-extend-move-back.service";
import { Subscription } from "rxjs";
import { PanelExtendService } from "../panel-extend.service";
import { PanelScopeEnchantmentService } from "../panel-scope-enchantment/panel-scope-enchantment.service";
import { PanelSoulService } from "../panel-soul/panel-soul.service";
import { PanelWidgetModel } from "../panel-widget/model";
import { cloneDeep } from "lodash";
import { debounceTime } from "rxjs/operators";
import { CombinationWidgetModel } from "../panel-scope-enchantment/model";
import { PanelAssistArborService } from "./panel-assist-arbor.service";
import { environment } from "environments/environment";

@Component({
    selector: "app-panel-assist-arbor",
    templateUrl: "./panel-assist-arbor.component.html",
    styleUrls: ["./panel-assist-arbor.component.scss", "./dropdown.scss"],
})
export class PanelAssistArborComponent implements OnInit {
    public environment = environment;
    // 订阅本地数据库DB发射过来的数据集
    private indexedDBDataRX$: Subscription;
    // 订阅轮廓值的创建
    private profileOuterSphereRX$: Subscription;
    // 订阅组合组件的轮廓值变化
    private combinationValueChangeRX$: Subscription;
    // 订阅组合
    private createComRX$: Subscription;
    // 订阅打散
    private disperseComRX$: Subscription;
    // 是否允许前进
    public get isMove(): boolean {
        return this.panelExtendMoveBackService.currentMoveBackInfoValue.isMove;
    }
    // 是否允许后退
    public get isBack(): boolean {
        return this.panelExtendMoveBackService.currentMoveBackInfoValue.isBack;
    }
    // 是否允许设置组合，需要选中多个组件才能创建组合
    public get isCombination(): boolean {
        return this.panelAssistArborService.isCombination;
    }
    // 是否允许设置打散，需要备选组件当中有组合元素组件
    public get isDisperse(): boolean {
        return this.panelAssistArborService.isDisperse;
    }

    constructor(
        private readonly panelExtendMoveBackService: PanelExtendMoveBackService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
        private readonly panelAssistArborService: PanelAssistArborService,
        private readonly panelSoulService: PanelSoulService,
        private readonly panelExtendService: PanelExtendService
    ) {
        this.profileOuterSphereRX$ = this.panelScopeEnchantmentService.scopeEnchantmentModel.profileOuterSphere$.subscribe(
            pro => {
                if (pro) {
                    this.combinationValueChangeRX$ = pro.valueChange$.pipe(debounceTime(1)).subscribe(() => {
                        const iW = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$
                            .value;
                        if (Array.isArray(iW)) {
                            iW.forEach(w => {
                                if (w.type == "combination" && Array.isArray(w.autoWidget.content)) {
                                    w.autoWidget.content.forEach(cw => {
                                        if (cw.profileModel.combinationWidgetData$) {
                                            this.handleCombinationAllChildWidgetProportion(cw);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        );
        this.createComRX$ = this.panelAssistArborService.launchCreateCombination$.subscribe(() => {
            this.createCombination();
        });
        this.disperseComRX$ = this.panelAssistArborService.launchDisperseCombination$.subscribe(() => {
            this.disperseCombination();
        });
    }

    ngOnInit() {
        this.indexedDBDataRX$ = this.panelExtendMoveBackService.launchDBDataValue$.subscribe(res => {
            const widgetList = JSON.parse(res.widgetList);
            if (Array.isArray(widgetList)) {
                this.panelScopeEnchantmentService.scopeEnchantmentModel.emptyAllProfile();
                this.panelExtendService.nextWidgetList(this.panelExtendService.handleFreeItemToPanelWidget(widgetList));
            }
        });
    }

    ngOnDestroy() {
        if (this.indexedDBDataRX$) this.indexedDBDataRX$.unsubscribe();
        if (this.combinationValueChangeRX$) this.combinationValueChangeRX$.unsubscribe();
        if (this.profileOuterSphereRX$) this.profileOuterSphereRX$.unsubscribe();
        if (this.createComRX$) this.createComRX$.unsubscribe();
        if (this.disperseComRX$) this.disperseComRX$.unsubscribe();
    }

    /**
     * 拉伸组合组件的时候保证其所有子集组件的四个方位比例不变
     * 根据childFourProportionObj计算
     */
    public handleCombinationAllChildWidgetProportion(widget: PanelWidgetModel): void {
        const widgetCom = widget.profileModel.combinationWidgetData$.value;
        if (widgetCom && widgetCom.insetProOuterSphereFourProportion) {
            const fourProp = widgetCom.insetProOuterSphereFourProportion;
            const combinationPro = widgetCom.combinationRoom;

            widgetCom.left = fourProp.left * combinationPro.profileModel.width;
            widgetCom.top = fourProp.top * combinationPro.profileModel.height;
            widgetCom.width = fourProp.right * combinationPro.profileModel.width - widgetCom.left;
            widgetCom.height = fourProp.bottom * combinationPro.profileModel.height - widgetCom.top;

            widget.profileModel.setData({
                width: widgetCom.width,
                height: widgetCom.height,
            });
            widget.addStyleToUltimatelyStyle({
                height: `${widget.profileModel.height}px`,
                width: `${widget.profileModel.width}px`,
            });
        }
    }

    /**
     * 接收前进和后退的回调
     */
    public handleMoveBack(type: "move" | "back"): void {
        if (type == "back") {
            this.panelExtendMoveBackService.acquireBackDBData();
        } else if (type == "move") {
            this.panelExtendMoveBackService.acquireMoveDBData();
        }
    }

    /**
     * 根据组合组件的轮廓值变化来计算其所有子集widget组件的轮廓数据
     */
    public handleCombinationChildWidgetProfileData(combination: PanelWidgetModel): void {
        const childWidget: Array<PanelWidgetModel> = combination.autoWidget.content;
        const comPro = combination.profileModel;
        if (Array.isArray(childWidget)) {
            childWidget.forEach(w => {
                const wCom = w.profileModel.combinationWidgetData$.value;
                if (wCom) {
                    w.profileModel.setData({
                        rotate: this.panelScopeEnchantmentService.conversionRotateOneCircle(
                            w.profileModel.immobilizationData.rotate + comPro.rotate
                        ),
                    });
                    /**
                     * 利用圆的公式计算在旋转的时候子集组件的中心点在其对应的椭圆边上
                     * (x ** 2 ) + (y ** 2) == r ** 2
                     * 先记录子集组件在以combination的中心点为坐标系圆点计算其对应的坐标
                     * 半径 radius
                     */
                    const coordinatesX = wCom.left - comPro.width / 2 + w.profileModel.width / 2;
                    const coordinatesY = comPro.height / 2 - wCom.top - w.profileModel.height / 2;
                    // 根据坐标和角度返回对应的新的坐标
                    const offsetCoord = this.panelScopeEnchantmentService.conversionRotateNewCoordinates(
                        [coordinatesX, coordinatesY],
                        comPro.rotate
                    );
                    if (offsetCoord) {
                        w.profileModel.setData({
                            left: w.profileModel.left + offsetCoord.left,
                            top: w.profileModel.top + offsetCoord.top,
                        });
                    }
                    wCom.removeInsetProOuterSphereFourProportion();
                }
            });
        }
    }

    /**
     * 创建组合
     * 创建之前保存原数据到indexedDB
     */
    public createCombination(): void {
        if (this.isCombination) {
            this.panelExtendService.launchSaveIndexedDB$.next();
            let panelCombination = this.panelSoulService.fixedWidget$.value.find(e => e.type == "combination");
            const insetW = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
            const profile = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
            if (panelCombination && insetW.length > 1) {
                panelCombination = cloneDeep(panelCombination);
                let combinationWidget = new PanelWidgetModel(panelCombination);
                let awaitInjectWidgetUniqueId: Array<string | number> = [];
                // 待赋值的组合内组件列表
                let awaitInjectWidget: Array<PanelWidgetModel> = this.handleDisperseWidgetList();
                // 先赋予组合组件宽高和位置
                combinationWidget.profileModel.setData({
                    left: profile.left,
                    top: profile.top,
                    width: profile.width,
                    height: profile.height,
                });
                insetW.forEach(w => {
                    awaitInjectWidgetUniqueId.push(w.uniqueId);
                    if (w.type != "combination") {
                        awaitInjectWidget.push(w);
                    }
                });
                awaitInjectWidget.forEach(w => {
                    const combinationData = new CombinationWidgetModel(combinationWidget);
                    combinationData.setData({
                        left: w.profileModel.left - combinationWidget.profileModel.left,
                        top: w.profileModel.top - combinationWidget.profileModel.top,
                        width: w.profileModel.width,
                        height: w.profileModel.height,
                        rotate: w.profileModel.rotate,
                    });
                    w.profileModel.combinationWidgetData$.next(combinationData);
                    // 计算子集组件在组合组件里的位置比例
                    w.profileModel.combinationWidgetData$.value.recordInsetProOuterSphereFourProportion();
                    w.profileModel.recordImmobilizationData();
                });
                combinationWidget.autoWidget.content = awaitInjectWidget;
                // 先删除组合组件内的映射组件
                this.panelExtendService.deletePanelWidget(awaitInjectWidgetUniqueId);
                // 再添加组合组件
                this.panelExtendService.addPanelWidget([combinationWidget]);
                // 再选中该组合组件
                this.panelScopeEnchantmentService.pushOuterSphereInsetWidget([combinationWidget]);
            }
        }
    }

    /**
     * 打散组合
     * 同时需要根据角度的不同计算left和top值，使其能够还原到组合前的位置
     * 打散之前保存原数据到indexedDB
     */
    public disperseCombination(): void {
        if (this.isDisperse) {
            this.panelExtendService.launchSaveIndexedDB$.next();
            // 从这些组合当中取出所有widget组件
            const allContentWidget = this.handleDisperseWidgetList();
            const insetWidget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$
                .value;
            // 待删除的组合组件的唯一id列表
            let comWidgetUniqueId = insetWidget.filter(e => e.type == "combination").map(e => e.uniqueId);
            // 先删除组合组件
            this.panelExtendService.deletePanelWidget(comWidgetUniqueId);
            // 再添加allContentWidget
            this.panelExtendService.addPanelWidget(allContentWidget);
            // 再选中所传的组件列表
            this.panelScopeEnchantmentService.pushOuterSphereInsetWidget(allContentWidget);
        }
    }

    /**
     * 执行打散操作但不选中其轮廓
     * 返回所有打散处理完的widget组件
     * isAddPro参数表示是否加上差值
     */
    public handleDisperseWidgetList(): Array<PanelWidgetModel> {
        const insetWidget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        let allContentWidget = [];
        insetWidget.forEach(w => {
            if (w.type == "combination" && Array.isArray(w.autoWidget.content)) {
                this.handleCombinationChildWidgetProfileData(w);
                w.autoWidget.content.forEach((e: PanelWidgetModel) => {
                    allContentWidget.push(e);
                });
            }
        });
        return allContentWidget;
    }
}
