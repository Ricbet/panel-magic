import { Component, OnInit, Input } from "@angular/core";
import { ClipPathResizeMaskService } from "../../panel-scope-enchantment/clip-path-resize-mask.service";
import {
    TPolygonType,
    ClipPointModel,
    ClipInsetModel,
    ClipPolygonModel,
    ClipCircleModel,
    ClipEllipseModel,
} from "../../panel-scope-enchantment/model";
import { PanelWidgetModel } from "../../panel-widget/model";
import { Subscription } from "rxjs";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { PanelScopeEnchantmentService } from "../../panel-scope-enchantment/panel-scope-enchantment.service";
import { debounceTime } from "rxjs/operators";

// 剪贴蒙版
@Component({
    selector: "app-panel-widget-clip-path",
    templateUrl: "./panel-widget-clip-path.component.html",
    styleUrls: ["./panel-widget-clip-path.component.scss"],
})
export class PanelWidgetClipPathComponent implements OnInit {
    private profileOuterSphereRX$: Subscription;
    private clipPointDragRX$: Subscription;
    // 订阅轮廓拉伸的变化
    private profileTensileMoveRX$: Subscription;

    @Input()
    public widget: PanelWidgetModel;

    // 父级宽高
    public get widgetProfile(): { width: number; height: number } {
        return { width: this.widget.profileModel.width, height: this.widget.profileModel.height };
    }
    // 正方形
    public get clipInsetPath(): ClipInsetModel {
        return this.clipPathResizeMaskService.clipInsetModel$.value;
    }
    // 多边形
    public get clipPolygonPath(): ClipPolygonModel {
        return this.clipPathResizeMaskService.clipPolygonModel$.value;
    }
    // 圆形
    public get clipCirclePath(): ClipCircleModel {
        return this.clipPathResizeMaskService.clipCircleModel$.value;
    }
    // 椭圆
    public get clipEllipsePath(): ClipEllipseModel {
        return this.clipPathResizeMaskService.clipEllipseModel$.value;
    }

    constructor(
        private readonly clipPathResizeMaskService: ClipPathResizeMaskService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService
    ) {
        this.clipPointDragRX$ = this.clipPathResizeMaskService.launchMouseDragClipPoint.subscribe(value => {
            if (value && value.drag) {
                if (this.clipPathResizeMaskService.clipPathMaskModel.currentPathType$.value == "inset") {
                    this.handleInsetClipDragPoint(value.drag, value.point);
                } else if (this.clipPathResizeMaskService.clipPathMaskModel.currentPathType$.value == "polygon") {
                    this.handlePoltgonClipDragPoint(value.drag, value.point);
                } else if (this.clipPathResizeMaskService.clipPathMaskModel.currentPathType$.value == "circle") {
                    this.handleCircleClipDragPoint(value.drag, value.point);
                } else if (this.clipPathResizeMaskService.clipPathMaskModel.currentPathType$.value == "ellipse") {
                    this.handleEllipseClipDragPoint(value.drag, value.point);
                }
            }
        });
        this.profileOuterSphereRX$ = this.panelScopeEnchantmentService.scopeEnchantmentModel.profileOuterSphere$.subscribe(
            pro => {
                if (pro) {
                    if (this.profileTensileMoveRX$) this.profileTensileMoveRX$.unsubscribe();
                    this.profileTensileMoveRX$ = pro.valueChange$.pipe(debounceTime(1)).subscribe(() => {
                        if (
                            this.clipPathResizeMaskService.clipPathMaskModel.currentPathType$.value == "circle" &&
                            this.clipCirclePath
                        ) {
                            this.clipCirclePath.handleCalcCircleSidePoint(this.widget.profileModel);
                        }
                    });
                }
            }
        );
    }

    ngOnInit() {
        const clipPath = this.widget.getObjKeyValue("panelClipPathModel");
        if (clipPath) {
            if (clipPath instanceof ClipInsetModel) {
                this.clipPathResizeMaskService.createInsetClip(<ClipInsetModel>clipPath);
            } else if (clipPath instanceof ClipEllipseModel) {
                this.clipPathResizeMaskService.createEllipseClip(<ClipEllipseModel>clipPath);
            } else if (clipPath instanceof ClipCircleModel) {
                this.clipPathResizeMaskService.createCircleClip(<ClipCircleModel>clipPath);
            } else if (clipPath instanceof ClipPolygonModel) {
                this.clipPathResizeMaskService.createPolygonClip("", <ClipPolygonModel>clipPath);
            }
        }
    }

    ngOnDestroy() {
        if (this.clipPointDragRX$) this.clipPointDragRX$.unsubscribe();
        if (this.profileOuterSphereRX$) this.profileOuterSphereRX$.unsubscribe();
        if (this.profileTensileMoveRX$) this.profileTensileMoveRX$.unsubscribe();
        this.clipPathResizeMaskService.emptyClipPath();
    }

    /**
     * 计算基于宽或高的百分比
     */
    public calcPer(drag: DraggablePort, targ: number, type: "width" | "height" = "width"): number {
        const calc =
            (((targ / 100) * this.widgetProfile[type] + drag[type == "width" ? "left" : "top"]) /
                this.widgetProfile[type]) *
            100;
        return calc <= 0 ? 0 : calc >= 100 ? 100 : calc;
    }

    /**
     * 一键重置
     */
    public resetClipData(): void {
        this.clipPathResizeMaskService.emptyClipPath();
        if (this.widget) {
            this.widget.delStyleToUltimatelyStyle("clip-path");
            this.widget.delObjKeyValue("panelClipPathModel");
        }
    }

    /**
     * 创建正方形蒙版
     */
    public createInsetClip(): void {
        this.clipPathResizeMaskService.createInsetClip();
        if (this.widget) {
            const inset = this.clipPathResizeMaskService.clipInsetModel$.value;
            this.widget.addObjKeyValue({ panelClipPathModel: inset });
            this.widget.addStyleToUltimatelyStyle(inset.styleContent);
        }
    }

    /**
     * 创建圆形
     * 同时计算圆周上的点的位置
     */
    public createCircleClip(): void {
        this.clipPathResizeMaskService.createCircleClip();
        if (this.widget) {
            const circle = this.clipPathResizeMaskService.clipCircleModel$.value;
            circle.handleCalcCircleSidePoint(this.widget.profileModel);
            this.widget.addObjKeyValue({ panelClipPathModel: circle });
            this.widget.addStyleToUltimatelyStyle(circle.styleContent);
        }
    }

    /**
     * 创建椭圆
     */
    public createEllpiseClip(): void {
        this.clipPathResizeMaskService.createEllipseClip();
        if (this.widget) {
            const ellipse = this.clipPathResizeMaskService.clipEllipseModel$.value;
            this.widget.addObjKeyValue({ panelClipPathModel: ellipse });
            this.widget.addStyleToUltimatelyStyle(ellipse.styleContent);
        }
    }

    /**
     * 创建多边形
     */
    public createPolygon(type: TPolygonType): void {
        this.clipPathResizeMaskService.createPolygonClip(type);
        if (this.widget) {
            const polygon = this.clipPathResizeMaskService.clipPolygonModel$.value;
            this.widget.addObjKeyValue({ panelClipPathModel: polygon });
            this.widget.addStyleToUltimatelyStyle(polygon.styleContent);
        }
    }

    /**
     * 拖拽椭圆的裁切点
     */
    public handleEllipseClipDragPoint(drag: DraggablePort, point: ClipPointModel): void {
        if (point.type === "ellipse-r") {
            point.left = this.calcPer(drag, point.left);
        } else if (point.type === "ellipse-b") {
            point.top = this.calcPer(drag, point.top, "height");
        } else if (point.type === "ellipse-c") {
            const radiusX = Math.abs(this.clipEllipsePath.ellR.left - this.clipEllipsePath.ellC.left);
            const radiusY = Math.abs(this.clipEllipsePath.ellB.top - this.clipEllipsePath.ellC.top);
            point.left = this.calcPer(drag, point.left);
            point.top = this.calcPer(drag, point.top, "height");
            this.clipEllipsePath.ellR.top = this.calcPer(drag, this.clipEllipsePath.ellR.top, "height");
            this.clipEllipsePath.ellB.left = this.calcPer(drag, this.clipEllipsePath.ellB.left);
            if (point.left >= 50) {
                this.clipEllipsePath.ellR.left = point.left - radiusX;
            } else if (point.left < 50) {
                this.clipEllipsePath.ellR.left = point.left + radiusX;
            }
            if (point.top >= 50) {
                this.clipEllipsePath.ellB.top = point.top - radiusY;
            } else if (point.top < 50) {
                this.clipEllipsePath.ellB.top = point.top + radiusY;
            }
        }
        this.widget.addStyleToUltimatelyStyle(this.clipEllipsePath.styleContent);
    }

    /**
     * 拖拽圆形的裁切点
     */
    public handleCircleClipDragPoint(drag: DraggablePort, point: ClipPointModel): void {
        if (point.type == "circle-c") {
            point.left = this.calcPer(drag, point.left);
            point.top = this.calcPer(drag, point.top, "height");
            this.clipCirclePath.handleCalcCircleSidePoint(this.widget.profileModel);
        } else if (point.type == "circle-side") {
            const k = this.clipCirclePath.calcSlopeK(this.widget.profileModel);
            const b = this.clipCirclePath.calcSlopeB(this.widget.profileModel);
            point.left += drag.left;
            point.top = this.widget.profileModel.height - (k * point.left + b);
            this.clipCirclePath.handleSideToRadius(this.widget.profileModel);
        }
        this.widget.addStyleToUltimatelyStyle(this.clipCirclePath.styleContent);
    }

    /**
     * 拖拽多边形的裁切点
     */
    public handlePoltgonClipDragPoint(drag: DraggablePort, point: ClipPointModel): void {
        point.left = this.calcPer(drag, point.left);
        point.top = this.calcPer(drag, point.top, "height");
        this.widget.addStyleToUltimatelyStyle(this.clipPolygonPath.styleContent);
    }

    /**
     * 拖拽正方形的裁切点
     */
    public handleInsetClipDragPoint(drag: DraggablePort, point: ClipPointModel): void {
        const mathObj = {
            "inset-l": () => {
                this.clipInsetPath.insetL.left = this.calcPer(drag, this.clipInsetPath.insetL.left);
                this.clipInsetPath.insetT.left =
                    this.clipInsetPath.insetL.left +
                    (this.clipInsetPath.insetR.left - this.clipInsetPath.insetL.left) / 2;
                this.clipInsetPath.insetB.left = this.clipInsetPath.insetT.left;
                this.clipInsetPath.insetC.left = this.clipInsetPath.insetT.left;
            },
            "inset-t": () => {
                this.clipInsetPath.insetT.top = this.calcPer(drag, this.clipInsetPath.insetT.top, "height");
                this.clipInsetPath.insetL.top =
                    this.clipInsetPath.insetT.top + (this.clipInsetPath.insetB.top - this.clipInsetPath.insetT.top) / 2;
                this.clipInsetPath.insetR.top = this.clipInsetPath.insetL.top;
                this.clipInsetPath.insetC.top = this.clipInsetPath.insetL.top;
            },
            "inset-r": () => {
                this.clipInsetPath.insetR.left = this.calcPer(drag, this.clipInsetPath.insetR.left);
                this.clipInsetPath.insetT.left =
                    this.clipInsetPath.insetL.left +
                    (this.clipInsetPath.insetR.left - this.clipInsetPath.insetL.left) / 2;
                this.clipInsetPath.insetB.left = this.clipInsetPath.insetT.left;
                this.clipInsetPath.insetC.left = this.clipInsetPath.insetT.left;
            },
            "inset-b": () => {
                this.clipInsetPath.insetB.top = this.calcPer(drag, this.clipInsetPath.insetB.top, "height");
                this.clipInsetPath.insetL.top =
                    this.clipInsetPath.insetT.top + (this.clipInsetPath.insetB.top - this.clipInsetPath.insetT.top) / 2;
                this.clipInsetPath.insetR.top = this.clipInsetPath.insetL.top;
                this.clipInsetPath.insetC.top = this.clipInsetPath.insetL.top;
            },
            "inset-c": () => {
                // 验证横向是否已达到边缘，是的话则不允许左右移动
                const isSideV = (): boolean => {
                    return (
                        this.calcPer(drag, this.clipInsetPath.insetL.left) == 0 ||
                        this.calcPer(drag, this.clipInsetPath.insetR.left) == 100
                    );
                };
                // 验证纵向是否已达到边缘，是的话则不允许上下移动
                const isSideH = (): boolean => {
                    return (
                        this.calcPer(drag, this.clipInsetPath.insetT.top, "height") == 0 ||
                        this.calcPer(drag, this.clipInsetPath.insetB.top, "height") == 100
                    );
                };
                if (!isSideV()) {
                    this.clipInsetPath.insetC.left = this.calcPer(drag, this.clipInsetPath.insetC.left);
                    this.clipInsetPath.insetL.left = this.calcPer(drag, this.clipInsetPath.insetL.left);
                    this.clipInsetPath.insetT.left = this.calcPer(drag, this.clipInsetPath.insetT.left);
                    this.clipInsetPath.insetR.left = this.calcPer(drag, this.clipInsetPath.insetR.left);
                    this.clipInsetPath.insetB.left = this.calcPer(drag, this.clipInsetPath.insetB.left);
                }
                if (!isSideH()) {
                    this.clipInsetPath.insetC.top = this.calcPer(drag, this.clipInsetPath.insetC.top, "height");
                    this.clipInsetPath.insetL.top = this.calcPer(drag, this.clipInsetPath.insetL.top, "height");
                    this.clipInsetPath.insetT.top = this.calcPer(drag, this.clipInsetPath.insetT.top, "height");
                    this.clipInsetPath.insetR.top = this.calcPer(drag, this.clipInsetPath.insetR.top, "height");
                    this.clipInsetPath.insetB.top = this.calcPer(drag, this.clipInsetPath.insetB.top, "height");
                }
            },
        };
        if (mathObj[point.type]) {
            mathObj[point.type]();
        }
        this.widget.addStyleToUltimatelyStyle(this.clipInsetPath.styleContent);
    }
}
