import { Component, OnInit, ViewChild, OnDestroy, NgZone, TemplateRef } from "@angular/core";
import { PanelScopeEnchantmentService } from "./panel-scope-enchantment.service";
import {
    ScopeEnchantmentModel,
    AuxliLineModel,
    CornerPinModel,
    PanelScopeTextEditorModel,
    OuterSphereHasAuxlModel,
} from "./model";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { Subscription, BehaviorSubject, fromEvent } from "rxjs";
import { PanelExtendService } from "../panel-extend.service";
import { debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import { ILocation } from "../model";
import { NzContextMenuService, NzDropdownMenuComponent } from "ng-zorro-antd";
import { PanelScopeTextEditorComponent } from "./panel-scope-text-editor/panel-scope-text-editor.component";
import { cloneDeep } from "lodash";
import { DraggableTensileCursorService } from "./draggable-tensile-cursor.service";
import { ClipPathResizeMaskService } from "./clip-path-resize-mask.service";
import { PanelScaleplateService } from "../panel-scaleplate/panel-scaleplate.service";
import { PanelExtendQuickShortcutsService } from "../panel-extend-quick-shortcuts.service";
import { PanelAssistArborService } from "../panel-assist-arbor/panel-assist-arbor.service";
import { PanelWidgetModel } from "../panel-widget/model";

@Component({
    selector: "app-panel-scope-enchantment",
    templateUrl: "./panel-scope-enchantment.component.html",
    styleUrls: ["./panel-scope-enchantment.component.scss", "./panel-scope-corner-pin.scss"],
})
export class PanelScopeEnchantmentComponent implements OnInit, OnDestroy {
    @ViewChild("widgetContextMenuEl", { static: true }) public widgetContextMenuEl: NzDropdownMenuComponent;
    @ViewChild("panelScopeTextEditorComponentEl", { static: false })
    public panelScopeTextEditorComponentEl: PanelScopeTextEditorComponent;

    private mouseIntcrementRX$: Subscription;
    private mouseContextMenu$: Subscription;
    private profileOuterSphereRX$: Subscription;
    private profileOuterSphereRotateRX$: Subscription;
    private rectRX$: Subscription;

    public get scopeEnchantment(): ScopeEnchantmentModel {
        return this.panelScopeEnchantmentService.scopeEnchantmentModel;
    }
    // 文本编辑器模式
    public get panelScopeTextEditor$(): BehaviorSubject<PanelScopeTextEditorModel> {
        return this.panelScopeEnchantmentService.panelScopeTextEditorModel$;
    }
    // 是否允许设置组合，需要选中多个组件才能创建组合
    public get isCombination(): boolean {
        return this.panelAssistArborService.isCombination;
    }
    // 是否允许设置打散，需要备选组件当中有组合元素组件
    public get isDisperse(): boolean {
        return this.panelAssistArborService.isDisperse;
    }

    // 当前选中的唯一一个widget组件
    public get onlyOneWidgetInfo(): PanelWidgetModel {
        const s = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
        return Array.isArray(s) && s.length == 1 ? s[0] : null;
    }

    public get clipPathService(): ClipPathResizeMaskService {
        return this.clipPathResizeMaskService
    }

    constructor(
        private readonly clipPathResizeMaskService: ClipPathResizeMaskService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
        private readonly panelExtendService: PanelExtendService,
        private readonly draggableTensileCursorService: DraggableTensileCursorService,
        private readonly panelExtendQuickShortcutsService: PanelExtendQuickShortcutsService,
        private readonly panelAssistArborService: PanelAssistArborService,
        private readonly panelScaleplateService: PanelScaleplateService,
        private readonly zone: NgZone,
        private readonly nzContextMenuService: NzContextMenuService
    ) {
        // 右键
        this.mouseContextMenu$ = this.panelScopeEnchantmentService.launchContextmenu$.subscribe(event => {
            // 生成右键菜单
            if (event) {
                this.nzContextMenuService.create(event, this.widgetContextMenuEl);
            }
        });

        this.mouseIntcrementRX$ = this.panelScopeEnchantmentService.launchMouseIncrement$
            .pipe()
            .subscribe((drag: DraggablePort) => {
                if (drag) {
                    this.handleProfileOuterSphereLocation(drag);
                }
            });

        this.rectRX$ = this.panelExtendService.selectionRectModel.launchRectData.subscribe(port => {
            this.handleRectInsetWidget(port);
        });

        // 生成完主轮廓之后计算其余组件的横线和竖线情况并保存起来
        // 同时取消文本编辑器模式
        this.profileOuterSphereRX$ = this.scopeEnchantment.profileOuterSphere$.pipe().subscribe(value => {
            const insetW = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
            if (value) {
                this.createAllLineSave();
                // 主轮廓创建完成就开启角度值监听
                this.openRotateSubject(value);
                // 根据角度计算主轮廓的offset坐标增量
                const cValue = cloneDeep(value);
                const offsetCoord = this.panelScopeEnchantmentService.handleOuterSphereRotateOffsetCoord(cValue);
                value.setOffsetAmount(offsetCoord);
                // 开始记录所有被选组件的位置比例
                insetW.forEach(w => {
                    w.profileModel.recordInsetProOuterSphereFourProportion(value);
                });
            }
            this.panelScopeEnchantmentService.panelScopeTextEditorModel$.next(null);
            this.clipPathService.emptyClipPath();
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.mouseIntcrementRX$) this.mouseIntcrementRX$.unsubscribe();
        if (this.mouseContextMenu$) this.mouseContextMenu$.unsubscribe();
        if (this.rectRX$) this.rectRX$.unsubscribe();
        if (this.profileOuterSphereRX$) this.profileOuterSphereRX$.unsubscribe();
        if (this.profileOuterSphereRotateRX$) this.profileOuterSphereRotateRX$.unsubscribe();
    }

    /**
     * 开启旋转角订阅
     */
    public openRotateSubject(proOuter: OuterSphereHasAuxlModel): void {
        setTimeout(() => {
            this.scopeEnchantment.handleCursorPinStyle(
                this.panelScopeEnchantmentService.conversionRotateOneCircle(proOuter.rotate)
            );
        });
        if (this.profileOuterSphereRotateRX$) this.profileOuterSphereRotateRX$.unsubscribe();
        this.profileOuterSphereRotateRX$ = proOuter.valueChange$
            .pipe(
                map(v => v.rotate),
                debounceTime(1),
                distinctUntilChanged()
            )
            .subscribe(value => {
                this.scopeEnchantment.handleCursorPinStyle(
                    this.panelScopeEnchantmentService.conversionRotateOneCircle(value)
                );
            });
    }

    /**
     * 根据鼠标偏移的增量来处理计算主轮廓的位置
     */
    public handleProfileOuterSphereLocation(drag: DraggablePort): void {
        // 计算主轮廓的位置
        this.scopeEnchantment.handleProfileOuterSphereLocationInsetWidget(drag);
        // 判断是否开启辅助线计算
        if (this.panelScopeEnchantmentService.isOpenAltCalc$.value) {
            // 同时把标尺已绘制的辅助线条并入到auxliLineModel里面！！！！
            const hLine = this.panelScaleplateService.canvasScaleplateModel.hLineList$.value;
            const vLine = this.panelScaleplateService.canvasScaleplateModel.vLineList$.value;
            const auxli = this.panelScopeEnchantmentService.auxliLineModel$.value;
            if (Array.isArray(hLine) && hLine.length > 0) {
                auxli.vLineList = auxli.vLineList.concat(hLine.map(v => v.inCanvasNum));
            }
            if (Array.isArray(vLine) && vLine.length > 0) {
                auxli.hLineList = auxli.hLineList.concat(vLine.map(v => v.inCanvasNum));
            }
            auxli.handleSetData();
            this.panelScopeEnchantmentService.auxliLineModel$.next(auxli);
            this.panelScopeEnchantmentService.handleAuxlineCalculate();
        } else {
            this.scopeEnchantment.valueProfileOuterSphere.resetAuxl();
        }
        // 计算主轮廓内所有被选组件的位置
        this.scopeEnchantment.handleLocationInsetWidget(drag);
    }

    /**
     * 根据rect矩形判断是否有组件在这个范围内，是的话则选中
     * 实现多选效果
     * 判断依据是大于左下角，小于右上角
     */
    public handleRectInsetWidget(port: ILocation): void {
        const allWidget = this.panelExtendService.valueWidgetList();
        const panelInfo = this.panelExtendService.panelInfoModel;
        let resutArr = [];
        if (port.width != 0 && port.height != 0) {
            allWidget.forEach(w => {
                let offsetCoord = { left: 0, top: 0 };
                if (w.profileModel.rotate != 0) {
                    offsetCoord = this.panelScopeEnchantmentService.handleOuterSphereRotateOffsetCoord(w.profileModel);
                }
                let tLeft = panelInfo.left + w.profileModel.left + offsetCoord.left;
                let tBottom = panelInfo.top + w.profileModel.height + w.profileModel.top + offsetCoord.top * -1;
                let tRight = tLeft + w.profileModel.width + offsetCoord.left * -2;
                let tTop = tBottom - w.profileModel.height + offsetCoord.top * 2;
                if (
                    tLeft > port.left &&
                    tBottom < port.top + port.height &&
                    tRight < port.left + port.width &&
                    tTop > port.top
                ) {
                    resutArr.push(w);
                }
            });
            this.panelScopeEnchantmentService.pushOuterSphereInsetWidget(resutArr);
        }
    }

    /**
     * 生成完主轮廓之后遍历其他不在主轮廓内的组件的横线和竖线
     * 计算并保存起来
     */
    public createAllLineSave(): void {
        const otherWidgetList = this.panelExtendService.valueWidgetList();
        const auxli = new AuxliLineModel();
        const panelInfo = this.panelExtendService.panelInfoModel;
        const fnOffset = this.panelScopeEnchantmentService.handleOuterSphereRotateOffsetCoord.bind(
            this.panelScopeEnchantmentService
        );
        if (Array.isArray(otherWidgetList)) {
            auxli.vLineList.push(0, panelInfo.width);
            auxli.hLineList.push(0, panelInfo.height);
            auxli.vcLineList.push(panelInfo.width / 2);
            auxli.hcLineList.push(panelInfo.height / 2);
            for (let i: number = 0, l = otherWidgetList.length; i < l; i++) {
                const pro = otherWidgetList[i].profileModel;
                const offsetCoor = fnOffset(otherWidgetList[i].profileModel);
                if (pro.isCheck == false) {
                    const lLeft = pro.left + offsetCoor.left;
                    const lRight = pro.left + pro.width + offsetCoor.left * -1;
                    const lTop = pro.top + offsetCoor.top;
                    const lBottom = pro.top + pro.height + offsetCoor.top * -1;
                    auxli.vLineList.push(lLeft, lRight);
                    auxli.hLineList.push(lTop, lBottom);
                    auxli.vcLineList.push(lLeft + pro.width / 2);
                    auxli.hcLineList.push(lTop + pro.height / 2);
                }
            }
            auxli.handleSetData();
            this.panelScopeEnchantmentService.auxliLineModel$.next(auxli);
        }
    }

    /**
     * 八个拖拽点按下的时候记录组件的固定值
     * 以及被选组件的固定值
     */
    public acceptDraggableMouseDown(): void {
        const pro = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
        const insetWidget = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
        pro.recordImmobilizationData();
        pro.setMouseCoord([pro.left, pro.top]);
        if (Array.isArray(insetWidget)) {
            insetWidget.forEach(e => {
                e.profileModel.recordImmobilizationData();
                e.profileModel.setMouseCoord([e.profileModel.left, e.profileModel.top]);
            });
        }
    }

    /**
     * 接收旋转角度的按下事件
     */
    public acceptRotateIco(mouse: MouseEvent): void {
        // 转弧度为度数的公式为 Math.atan( x )*180/Math.PI
        mouse.stopPropagation();
        let mouseMove$: Subscription;
        let mouseUp$: Subscription;
        const pro = this.scopeEnchantment.valueProfileOuterSphere;
        const panelInfo = this.panelExtendService.panelInfoModel;
        let rotate: number = null;
        mouseMove$ = fromEvent(document, "mousemove").subscribe((move: MouseEvent) => {
            this.zone.run(() => {
                // 记录轮廓中心坐标点
                const proCenterCoor = [
                    pro.left + pro.width / 2 + panelInfo.left,
                    pro.top + pro.height / 2 + panelInfo.top,
                ];
                const calcX = move.pageX - proCenterCoor[0];
                const calcY = proCenterCoor[1] - move.pageY;
                rotate = this.panelScopeEnchantmentService.conversionTwoCoordToRotate([calcX, calcY]);
                this.scopeEnchantment.valueProfileOuterSphere.setData({ rotate: rotate });
                this.scopeEnchantment.outerSphereInsetWidgetList$.value.forEach(e => {
                    e.profileModel.setData({ rotate: rotate });
                });
            });
        });
        mouseUp$ = fromEvent(document, "mouseup").subscribe(() => {
            this.zone.run(() => {
                if (mouseMove$) mouseMove$.unsubscribe();
                if (mouseUp$) mouseUp$.unsubscribe();
            });
        });
    }

    /**
     * 接受八个拖拽点移动的回调
     * 同时重新记录被选组件在主轮廓里的位置比例
     */
    public acceptDraggableCursor(drag: DraggablePort, corner: CornerPinModel): void {
        const insetWidget = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
        const pro = this.scopeEnchantment.valueProfileOuterSphere;
        if (pro && Array.isArray(insetWidget)) {
            insetWidget.forEach(w => {
                w.profileModel.recordInsetProOuterSphereFourProportion(this.scopeEnchantment.valueProfileOuterSphere);
            });
        }
        this.draggableTensileCursorService.acceptDraggableCursor(drag, corner);
    }

    public handleZIndexTopOrBottom(type: "top" | "bottom"): void {
        this.panelExtendService.handleZIndexTopOrBottom(this.scopeEnchantment.outerSphereInsetWidgetList$.value, type);
    }

    public copyWidgetInsetPaste(): void {
        this.panelExtendQuickShortcutsService.performCopy();
    }

    public cutWidgetInsetPaste(): void {
        this.panelExtendQuickShortcutsService.performCutWidget();
    }

    public delWidget(): void {
        this.panelExtendQuickShortcutsService.performDelWidget();
    }

    public createCombination(): void {
        this.panelAssistArborService.launchCreateCombination$.next();
    }

    public disperseCombination(): void {
        this.panelAssistArborService.launchDisperseCombination$.next();
    }
}
