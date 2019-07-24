import { Component, OnInit } from "@angular/core";
import { PanelLayerService } from "./panel-layer.service";
import { PanelExtendService } from "../panel-extend.service";
import { Subscription, BehaviorSubject } from "rxjs";
import { SoulLayerModel, LayerModel } from "./model";
import { PanelScopeEnchantmentService } from "../panel-scope-enchantment/panel-scope-enchantment.service";
import { debounceTime } from "rxjs/operators";
import { panelWidgetFixedContainerLsit } from "../panel-widget/all-widget-container";
import { panelWidgetFixedUnitLsit } from "../panel-widget/all-widget-unit";
import { panelWidgetFixedVesselLsit } from "../panel-widget/all-widget-vessel";
import { PanelWidgetModel } from "../panel-widget/model";
import { PanelSeniorVesselEditService } from "../panel-senior-vessel-edit/panel-senior-vessel-edit.service";

@Component({
    selector: "app-panel-layer",
    templateUrl: "./panel-layer.component.html",
    styleUrls: ["./panel-layer.component.scss"],
})
export class PanelLayerComponent implements OnInit {
    private widgetListRX$: Subscription;
    private vesselWidgetLisrRX$: Subscription;
    private temporaryProfileRX$: Subscription;
    private insetWidgetProfileRX$: Subscription;
    private allFixedWidgetList = [
        ...panelWidgetFixedContainerLsit,
        ...panelWidgetFixedUnitLsit,
        ...panelWidgetFixedVesselLsit,
    ];
    // 图层数据索引模式，便于查询
    private keysObjLayerWidget: {} = {};
    public get soulLayer(): SoulLayerModel {
        return this.panelLayerService.soulLayerModel;
    }
    public get layerWidgetList$(): BehaviorSubject<Array<LayerModel>> {
        return this.panelLayerService.soulLayerModel.layerWidgetList$;
    }
    // 记录最后一个选中的组件, 用来实现shift多选
    public lastOneCheckWidgetLayer$: BehaviorSubject<LayerModel> = new BehaviorSubject(null);

    constructor(
        private readonly panelExtendService: PanelExtendService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
        private readonly panelLayerService: PanelLayerService,
        private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService
    ) {
        this.widgetListRX$ = this.panelExtendService.widgetList$.subscribe(value => {
            if (!panelSeniorVesselEditService.isEnterEditVesselCondition$.value)
                this.handleWidgetListToLayerModel(value);
        });
        this.vesselWidgetLisrRX$ = this.panelSeniorVesselEditService.riverDiversionWidgetList$.subscribe(value => {
            if (panelSeniorVesselEditService.isEnterEditVesselCondition$.value)
                this.handleWidgetListToLayerModel(value);
        });
        this.temporaryProfileRX$ = this.panelLayerService.launchMouseEnterOut.subscribe(value => {
            if (value) {
                const _type = value.type;
                if (this.keysObjLayerWidget[value.widget.uniqueId]) {
                    this.keysObjLayerWidget[value.widget.uniqueId].isHover = _type == "enter" ? true : false;
                }
            }
        });
        this.insetWidgetProfileRX$ = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$
            .pipe(debounceTime(1))
            .subscribe(value => {
                if (Array.isArray(value) && value.length > 0) {
                    let objWidget = {};
                    const layer = this.layerWidgetList$.value;
                    value.forEach(e => (objWidget[e.uniqueId] = e));
                    layer.forEach(e => {
                        if (objWidget[e.widget.uniqueId]) {
                            e.isActive = true;
                            this.lastOneCheckWidgetLayer$.next(e);
                        } else {
                            e.isActive = false;
                        }
                    });
                } else {
                    this.soulLayer.resetAllLayerActive();
                }
            });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.widgetListRX$) this.widgetListRX$.unsubscribe();
        if (this.temporaryProfileRX$) this.temporaryProfileRX$.unsubscribe();
        if (this.insetWidgetProfileRX$) this.insetWidgetProfileRX$.unsubscribe();
        if (this.vesselWidgetLisrRX$) this.vesselWidgetLisrRX$.unsubscribe();
    }

    /**
     * 将当前的widgetlist转化为图层数据模型
     */
    public handleWidgetListToLayerModel(value: PanelWidgetModel[]): void {
        if (Array.isArray(value)) {
            const arr = [];
            this.keysObjLayerWidget = {};
            const insetWidget = (_wid: PanelWidgetModel): PanelWidgetModel => {
                return this.allFixedWidgetList.find(_w => _w.type == _wid.type);
            };
            value.forEach(e => {
                const widgetE = insetWidget(e);
                if (widgetE) {
                    e.name = widgetE.name;
                    e.icon = widgetE.icon;
                    const layer = new LayerModel(e);
                    if (e.type == "combination" && Array.isArray(e.autoWidget.content)) {
                        e.autoWidget.content.forEach(w => {
                            if (w.type != "combination") {
                                const widgetCombination = insetWidget(w);
                                if (widgetCombination) {
                                    w.name = widgetCombination.name;
                                    w.icon = widgetCombination.icon;
                                    layer.combinationWidgetList.push(new LayerModel(w));
                                }
                            }
                        });
                    }
                    arr.push(layer);
                    setTimeout(() => {
                        this.keysObjLayerWidget[e.uniqueId] = layer;
                    });
                }
            });
            this.layerWidgetList$.next(arr.reverse());
        }
    }

    /**
     * 接收图层的鼠标移入和移出事件
     */
    public acceptMouseMoveOut(type: "enter" | "out", layer: LayerModel): void {
        if (type == "enter") {
            layer.isHover = true;
            this.panelScopeEnchantmentService.handleTemporaryProfile(layer.widget, "enter");
        } else if (type == "out") {
            layer.isHover = false;
            this.panelScopeEnchantmentService.scopeEnchantmentModel.resetProfileTemporary$();
        }
    }

    /**
     * 选中某一个图层传递该widget数据
     */
    public checkLayer(layer: LayerModel, mouse: MouseEvent): void {
        // 如果选中的是组合组件里的子集组件则不允许多选
        const isCombination: boolean = layer.widget.profileModel.combinationWidgetData$.value ? true : false;
        if (!isCombination) {
            if (mouse.shiftKey == true) {
                this.pressShiftCheckWidgetList(layer);
            } else if (mouse.metaKey == true || mouse.ctrlKey == true) {
                this.panelScopeEnchantmentService.toggleOuterSphereInsetWidget(layer.widget);
            } else {
                this.panelScopeEnchantmentService.onlyOuterSphereInsetWidget(layer.widget);
            }
        } else {
            this.panelScopeEnchantmentService.onlyOuterSphereInsetWidget(layer.widget);
        }
    }

    /**
     * 处理按住shift选中多个组件的数据
     */
    public pressShiftCheckWidgetList(layer: LayerModel): void {
        console.log(this.keysObjLayerWidget);
        if (this.lastOneCheckWidgetLayer$.value) {
            // 转化keysObjLayerWidget为数组
            const layerWidgetList: LayerModel[] = [];
            // 先把isActive为true的存起来
            const _all_is_active_true = [];
            // 最后一个被选中的下标
            let _last_check_index: number = null;
            // 当前选中的组件在keysObjLayerWidget里的下标
            let _current_widget_index: number = null;
            Object.keys(this.keysObjLayerWidget).forEach((_w, _i) => {
                layerWidgetList.push(this.keysObjLayerWidget[_w]);
                if (this.keysObjLayerWidget[_w].isActive == true)
                    _all_is_active_true.push(this.keysObjLayerWidget[_w].widget);
                if (this.lastOneCheckWidgetLayer$.value.widget.uniqueId == _w) _last_check_index = _i;
                if (layer.widget.uniqueId == _w) _current_widget_index = _i;
            });

            if (_current_widget_index > _last_check_index) {
                for (let i = _last_check_index; i <= _current_widget_index; i++) {
                    if (layerWidgetList[i].isActive == false) {
                        layerWidgetList[i].isActive = true;
                        _all_is_active_true.push(layerWidgetList[i].widget);
                    }
                }
            } else if (_current_widget_index < _last_check_index) {
                for (let i = _current_widget_index; i <= _last_check_index; i++) {
                    if (layerWidgetList[i].isActive == false) {
                        layerWidgetList[i].isActive = true;
                        _all_is_active_true.push(layerWidgetList[i].widget);
                    }
                }
            }
            this.panelScopeEnchantmentService.pushOuterSphereInsetWidget(_all_is_active_true);
        } else {
            this.panelScopeEnchantmentService.onlyOuterSphereInsetWidget(layer.widget);
        }
    }

    /**
     * 删除某一个图层的操作
     */
    public deleteLayer(layer: LayerModel, event: MouseEvent): void {
        event.stopPropagation();
        this.panelExtendService.deletePanelWidget("" + layer.widget.uniqueId);
        this.panelScopeEnchantmentService.scopeEnchantmentModel.emptyAllProfile();
    }

    /**
     * 点击组合组件的下拉框图标以用来展开或收起组合组件内的组件
     */
    public acceptCombinationWidget(layer: LayerModel): void {
        layer.isDropDown = !layer.isDropDown;
    }
}
