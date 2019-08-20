import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy } from "@angular/core";
import { CanvasScaleplateModel, LineModel, lineType } from "./model";
import { PanelExtendService } from "../panel-extend.service";
import { PanelInfoModel, TransformMatrixModel } from "../model";
import { Subscription, BehaviorSubject, fromEvent } from "rxjs";
import { PanelScaleplateService } from "./panel-scaleplate.service";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { debounceTime, tap } from "rxjs/operators";

@Component({
    selector: "app-panel-scaleplate",
    templateUrl: "./panel-scaleplate.component.html",
    styleUrls: ["./panel-scaleplate.component.scss"],
})
export class PanelScaleplateComponent implements OnInit, OnDestroy {
    // 最外层的容器宿主
    @ViewChild("mbRulerEl", { static: true })
    public mbRulerEl: ElementRef;
    @ViewChild("hCanvasEl", { static: true })
    public hCanvasEl: ElementRef;
    @ViewChild("vCanvasEl", { static: true })
    public vCanvasEl: ElementRef;
    // 检测窗口size变化的事件
    private windowSizeChange$: Subscription;
    // 监听鼠标移动事件
    private mouseMove$: Subscription;
    // 订阅视图移动变化的观察者
    private panelTransformMatricChangeRX$: Subscription;
    // 订阅通知回到原点的观察者
    private originBackRX$: Subscription;
    public get hRuler(): HTMLCanvasElement {
        return this.hCanvasEl.nativeElement;
    }
    public get vRuler(): HTMLCanvasElement {
        return this.vCanvasEl.nativeElement;
    }
    public get transformMatrixModel(): TransformMatrixModel {
        return this.panelExtendService.transformMatrixModel;
    }
    public get canvasScaleplateModel(): CanvasScaleplateModel {
        return this.panelScaleplateService.canvasScaleplateModel;
    }
    public get temporaryLine$(): BehaviorSubject<LineModel> {
        return this.canvasScaleplateModel.temporaryLine$;
    }
    public get hLineList$(): BehaviorSubject<Array<LineModel>> {
        return this.canvasScaleplateModel.hLineList$;
    }
    public get vLineList$(): BehaviorSubject<Array<LineModel>> {
        return this.canvasScaleplateModel.vLineList$;
    }
    public get isOpenMoveLine(): boolean {
        return this.panelScaleplateService.isOpenMoveLine$.value;
    }
    public get isShowLine(): boolean {
        return this.panelScaleplateService.isShowLine$.value;
    }
    // 主视图模型属性
    public get panelInfoModel(): PanelInfoModel {
        return this.panelExtendService.panelInfoModel;
    }
    constructor(
        private readonly panelExtendService: PanelExtendService,
        private readonly panelScaleplateService: PanelScaleplateService,
        private readonly zone: NgZone
    ) {
        this.windowSizeChange$ = fromEvent(window, "resize")
            .pipe(
                tap(() => {
                    this.panelExtendService.launchRecordPanelInfoRect$.next();
                })
            )
            .subscribe(() => {
                this.zone.run(() => {
                    this.calcCanvasRulerSize();
                    this.createHRulerRect();
                    this.createVRulerRect();
                    this.calcAllHVLineDrag();
                });
            });
        this.panelTransformMatricChangeRX$ = this.panelExtendService.transformMatrixModel.valueChange$
            .pipe(
                debounceTime(1),
                tap(() => {
                    this.panelExtendService.launchRecordPanelInfoRect$.next();
                })
            )
            .subscribe(() => {
                this.createHRulerRect();
                this.createVRulerRect();
                // 如果有辅助线则根据面板偏移量移动
                this.calcAllHVLineDrag();
            });
        this.originBackRX$ = this.panelScaleplateService.launchOrigin$
            .pipe(
                tap(() => {
                    this.transformMatrixModel.reset();
                    this.panelExtendService.trackModel.reset();
                })
            )
            .subscribe(() => {
                this.panelExtendService.launchRecordPanelInfoRect$.next();
                this.calcCanvasRulerSize();
                this.createHRulerRect();
                this.createVRulerRect();
                this.calcAllHVLineDrag();
            });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.panelInfoModel.recordImmobilizationData();
            this.createHRulerRect();
            this.createVRulerRect();
        });
    }

    ngOnInit() {
        this.calcCanvasRulerSize();
    }

    ngOnDestroy() {
        if (this.windowSizeChange$) this.windowSizeChange$.unsubscribe();
        if (this.panelTransformMatricChangeRX$) this.panelTransformMatricChangeRX$.unsubscribe();
        if (this.mouseMove$) this.mouseMove$.unsubscribe();
        if (this.originBackRX$) this.originBackRX$.unsubscribe();
    }

    /**
     * 初始化标尺的宽度和高度，同时根据窗口大小的改变重新计算
     */
    public calcCanvasRulerSize(): void {
        if (this.mbRulerEl && this.mbRulerEl.nativeElement) {
            const rect = this.mbRulerEl.nativeElement.getBoundingClientRect();
            this.canvasScaleplateModel.width = rect.width - 16;
            this.canvasScaleplateModel.height = rect.height - 16;
        }
    }

    /**
     * 绘制线条
     */
    public drawLine(
        rule: CanvasRenderingContext2D,
        move: { moveStart: number; moveEnd: number },
        line: { lineStart: number; lineEnd: number },
        color: string
    ): void {
        rule.beginPath();
        rule.strokeStyle = color;
        rule.moveTo(move.moveStart, move.moveEnd);
        rule.lineTo(line.lineStart, line.lineEnd);
        rule.stroke();
    }

    /**
     * 创建横向的标尺
     */
    public createHRulerRect(): void {
        const h = this.hRuler.getContext("2d");
        const panelLeftCalc = this.panelInfoModel.left - 216;
        this.hRuler.width = this.canvasScaleplateModel.width;
        h.transform(1, 0, 0, 1, this.transformMatrixModel.translateX, 0);
        h.fillStyle = "#f9fafb";
        h.fillRect(-this.transformMatrixModel.translateX, 0, this.canvasScaleplateModel.width, 16);
        // 创建新的矩阵
        h.setTransform(1, 0, 0, 1, panelLeftCalc, 0);
        h.lineWidth = 2;
        const handleDrawLine = (i: number) => {
            this.drawLine(
                h,
                { moveStart: i * 10, moveEnd: i % 10 == 0 ? 0 : 10 },
                { lineStart: i * 10, lineEnd: 16 },
                "#ccc"
            );
            this.drawLine(
                h,
                { moveStart: i * 10 + 1, moveEnd: i % 10 == 0 ? 0 : 10 },
                { lineStart: i * 10 + 1, lineEnd: 16 },
                "#f9fafb"
            );
            if (i % 10 == 0) {
                h.font = "normal normal bold 12px";
                h.fillStyle = "#2b3c4d";
                h.fillText(i * 10 + "", i * 10 + 4, 10);
            }
        };
        for (let i: number = 0; i < (this.canvasScaleplateModel.width - panelLeftCalc) / 10; i++) {
            handleDrawLine(i);
        }
        for (let i: number = 0; i > -panelLeftCalc / 10; i--) {
            handleDrawLine(i);
        }
    }

    /**
     * 创建纵向的标尺
     */
    public createVRulerRect(): void {
        const v = this.vRuler.getContext("2d");
        const textV = this.vRuler.getContext("2d");
        const panelTopCalc = this.panelInfoModel.top - 66;
        this.vRuler.height = this.canvasScaleplateModel.height;
        v.transform(1, 0, 0, 1, 0, this.transformMatrixModel.translateY);
        v.fillStyle = "#f9fafb";
        v.fillRect(0, -this.transformMatrixModel.translateY, 16, this.canvasScaleplateModel.height);
        // 创建新的矩阵
        v.setTransform(1, 0, 0, 1, 0, panelTopCalc);
        v.lineWidth = 2;
        const handleDrawLine = (i: number) => {
            this.drawLine(
                v,
                { moveStart: i % 10 == 0 ? 0 : 10, moveEnd: i * 10 },
                { lineStart: 16, lineEnd: i * 10 },
                "#ccc"
            );
            this.drawLine(
                v,
                { moveStart: i % 10 == 0 ? 0 : 10, moveEnd: i * 10 - 1 },
                { lineStart: 16, lineEnd: i * 10 - 1 },
                "#f9fafb"
            );
            if (i % 10 == 0) {
                textV.save();
                textV.textAlign = "center";
                textV.textBaseline = "middle";
                textV.translate(6, i * 10 - 14);
                textV.rotate((-90 * Math.PI) / 180);
                textV.font = "normal normal bold 12px";
                textV.fillStyle = "#2b3c4d";
                textV.fillText(i * 10 + "", 0, 0);
                textV.restore();
            }
        };
        for (let i: number = 0; i < (this.canvasScaleplateModel.height - panelTopCalc) / 10; i++) {
            handleDrawLine(i);
        }
        for (let i: number = 0; i > -panelTopCalc / 10; i--) {
            handleDrawLine(i);
        }
    }

    /**
     * 接受canvas面板鼠标移入
     */
    public acceptCanvasMouseEnter(type: lineType): void {
        if (this.mouseMove$) this.mouseMove$.unsubscribe();
        const temLine = new LineModel(type);
        this.mouseMove$ = fromEvent(type == "h" ? this.hRuler : this.vRuler, "mousemove").subscribe(
            (move: MouseEvent) => {
                this.zone.run(() => {
                    if (type == "h") {
                        temLine.setInCanvasNum(move.pageX - 216 - (this.panelInfoModel.left - 216));
                        temLine.setInPanelNum(move.pageX - 216);
                    } else if (type == "v") {
                        temLine.setInCanvasNum(move.pageY - 66 - (this.panelInfoModel.top - 66));
                        temLine.setInPanelNum(move.pageY - 66);
                    }
                    this.canvasScaleplateModel.temporaryLine$.next(temLine);
                });
            }
        );
    }

    /**
     * 接受canvas面板鼠移出
     */
    public acceptCanvasMouseOut(): void {
        if (this.mouseMove$) this.mouseMove$.unsubscribe();
        this.temporaryLine$.next(null);
    }

    /**
     * 创建辅助线
     */
    public createLineList(type: lineType): void {
        const temPanelNum = this.temporaryLine$.value;
        const line = new LineModel(type);
        line.setInPanelNum(temPanelNum.inPanelNum);
        line.setInCanvasNum(temPanelNum.inCanvasNum);
        this.panelScaleplateService[type == "h" ? "addHLine" : "addVLine"](line);
        this.panelScaleplateService.isShowLine$.next(true);
    }

    /**
     * 计算面板移动带来的偏移量而改变所有绘制的辅助线
     */
    public calcAllHVLineDrag(): void {
        const vLine = this.vLineList$.value;
        const hLine = this.hLineList$.value;
        if (Array.isArray(vLine)) {
            vLine.forEach(v => {
                v.setInPanelNum(v.inCanvasNum + this.panelInfoModel.top - 66);
            });
        }
        if (Array.isArray(hLine)) {
            hLine.forEach(h => {
                h.setInPanelNum(h.inCanvasNum + this.panelInfoModel.left - 216);
            });
        }
    }

    /**
     * 接收已绘制好的线条的移入事件
     */
    public acceptLineEnter(line: LineModel): void {
        line.isAllowDel = true;
        this.temporaryLine$.next(null);
    }

    /**
     * 接收已绘制好的线条的移出事件
     */
    public acceptLineOut(line: LineModel): void {
        line.isAllowDel = false;
        this.temporaryLine$.next(null);
    }

    /**
     * 接收拖拽已绘制好的线条
     */
    public acceptDraggleLine(drag: DraggablePort, line: LineModel): void {
        if (drag) {
            line.setInCanvasNum(line.inCanvasNum + drag[line.type == "h" ? "left" : "top"]);
            line.setInPanelNum(line.inPanelNum + drag[line.type == "h" ? "left" : "top"]);
        }
    }

    /**
     * 删除横向和纵向的已绘制好的线条
     */
    public acceptDelLine(index: number, type: lineType): void {
        this.panelScaleplateService[type == "h" ? "delHLine" : "delVLine"](index);
    }

    /**
     * 回到原点
     */
    public backOrigin(): void {
        this.panelScaleplateService.launchOrigin$.next();
    }

    /**
     * 控制辅助线是显示还是隐藏
     */
    public controlLineShowOrHide(): void {
        this.panelScaleplateService.controlLineShowOrHide();
    }

    /**
     * 清空所有辅助线
     */
    public emptyAllLine(): void {
        this.panelScaleplateService.emptyAllLine();
    }
}
