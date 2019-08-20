import { Injectable } from "@angular/core";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { CornerPinModel, ProfileModel } from "./model";
import { PanelScopeEnchantmentService } from "./panel-scope-enchantment.service";
import { PanelWidgetModel } from "../panel-widget/model";
import { BehaviorSubject } from "rxjs";

/**
 * 八个方位的拖拽拉伸计算 服务
 */
@Injectable()
export class DraggableTensileCursorService {
    // 是否按住了shift键从而等比例的进行缩放
    public isOpenConstrainShift$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService) {}

    // 计算pro轮廓的sin偏移量
    public calcSinOffset(pro: ProfileModel, type: "height" | "width"): number {
        return this.panelScopeEnchantmentService.calcNumSin((pro[type] - pro.immobilizationData[type]) / 2, pro.rotate);
    }

    // 计算pro轮廓的cos偏移量
    public calcCosOffset(pro: ProfileModel, type: "height" | "width"): number {
        return (
            this.panelScopeEnchantmentService.calcNumCos((pro[type] - pro.immobilizationData[type]) / 2, pro.rotate) +
            (pro[type] - pro.immobilizationData[type]) / 2
        );
    }

    // 计算pro轮廓的1-cos偏移量,用于计算right拉伸和bottom的拉伸计算
    public calcCosOffsetReducOne(pro: ProfileModel, type: "height" | "width"): number {
        return (
            ((1 - Math.cos(this.panelScopeEnchantmentService.conversionRotateToMathDegree(pro.rotate))) *
                (pro[type] - pro.immobilizationData[type])) /
            2
        );
    }

    // 根据旋转角度计算DraggablePort鼠标坐标点返回的坐标点，使其在旋转到对应的角度之后，被拉伸的方向也一致
    public calcRotateDraggablePort(drag: DraggablePort, rotate: number, type: "l" | "t" | "r" | "b"): number {
        const s = {
            l:
                this.panelScopeEnchantmentService.calcNumCos(drag.left * -1, rotate) +
                this.panelScopeEnchantmentService.calcNumSin(drag.top * -1, rotate),
            t:
                this.panelScopeEnchantmentService.calcNumCos(drag.top * -1, rotate) +
                this.panelScopeEnchantmentService.calcNumSin(drag.left, rotate),
            r:
                this.panelScopeEnchantmentService.calcNumCos(drag.left, rotate) +
                this.panelScopeEnchantmentService.calcNumSin(drag.top, rotate),
            b:
                this.panelScopeEnchantmentService.calcNumCos(drag.top, rotate) +
                this.panelScopeEnchantmentService.calcNumSin(drag.left * -1, rotate),
        };
        return s[type] ? Math.round(s[type]) : 0;
    }

    /**
     * 调整被选中组件在主轮廓里的位置比例
     * 同时根据角度限制主轮廓完全包住被选组件
     */
    public handleInsetWidgetPositionProportion(wPro: PanelWidgetModel): void {
        const pro = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
        if (wPro.profileModel.insetProOuterSphereFourProportion) {
            wPro.profileModel.left = pro.width * wPro.profileModel.insetProOuterSphereFourProportion.left + pro.left;
            wPro.profileModel.top = pro.height * wPro.profileModel.insetProOuterSphereFourProportion.top + pro.top;
            wPro.profileModel.width =
                pro.width * wPro.profileModel.insetProOuterSphereFourProportion.right -
                wPro.profileModel.left +
                pro.left;
            wPro.profileModel.height =
                pro.height * wPro.profileModel.insetProOuterSphereFourProportion.bottom -
                wPro.profileModel.top +
                pro.top;
            wPro.addStyleToUltimatelyStyle({
                height: `${wPro.profileModel.height}px`,
                width: `${wPro.profileModel.width}px`,
            });
        }
    }

    /**
     * 在拖拽的过程当中重新计算主轮廓的大小和位置
     * 重新调整使其能够完全包住所有被选组件
     */
    public handleCalcProfileOuterSphere(drag: DraggablePort): void {
        const pro = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
        const insetWidget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        if (insetWidget.length > 1 && drag) {
            const sphere = this.panelScopeEnchantmentService.calcProfileOuterSphereInfo();
            pro.setData({
                left: sphere.left,
                top: sphere.top,
                width: sphere.width,
                height: sphere.height,
            });
        }
    }

    /**
     * 接受八个拖拽点移动的回调
     */
    public acceptDraggableCursor(drag: DraggablePort, corner: CornerPinModel): void {
        const insetWidget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        if (drag && corner.cursor != undefined) {
            const pro = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
            const objCur = {
                l: () => {
                    pro.setData({
                        width: pro.width + this.calcRotateDraggablePort(drag, pro.rotate, "l"),
                    });
                    pro.setData({
                        height: this.isOpenConstrainShift$.value
                            ? (pro.immobilizationData.height / pro.immobilizationData.width) * pro.width
                            : pro.immobilizationData.height,
                    });
                    pro.setData({
                        left: Math.round(
                            pro.immobilizationData.left -
                                this.calcSinOffset(pro, "height") -
                                this.calcCosOffset(pro, "width")
                        ),
                        top: Math.round(
                            pro.immobilizationData.top -
                                this.calcCosOffsetReducOne(pro, "height") -
                                this.calcSinOffset(pro, "width")
                        ),
                    });
                },
                t: () => {
                    pro.setData({
                        height: pro.height + this.calcRotateDraggablePort(drag, pro.rotate, "t"),
                    });
                    pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (pro.immobilizationData.width / pro.immobilizationData.height) * pro.height
                            : pro.immobilizationData.width,
                    });
                    pro.setData({
                        left: Math.round(
                            pro.immobilizationData.left -
                                this.calcCosOffsetReducOne(pro, "width") +
                                this.calcSinOffset(pro, "height")
                        ),
                        top: Math.round(
                            pro.immobilizationData.top +
                                this.calcSinOffset(pro, "width") -
                                this.calcCosOffset(pro, "height")
                        ),
                    });
                },
                r: () => {
                    pro.setData({
                        width: pro.width + this.calcRotateDraggablePort(drag, pro.rotate, "r"),
                    });
                    pro.setData({
                        height: this.isOpenConstrainShift$.value
                            ? (pro.immobilizationData.height / pro.immobilizationData.width) * pro.width
                            : pro.immobilizationData.height,
                    });
                    pro.setData({
                        left: Math.round(
                            pro.immobilizationData.left -
                                this.calcSinOffset(pro, "height") -
                                this.calcCosOffsetReducOne(pro, "width")
                        ),
                        top: Math.round(
                            pro.immobilizationData.top -
                                this.calcCosOffsetReducOne(pro, "height") +
                                this.calcSinOffset(pro, "width")
                        ),
                    });
                },
                b: () => {
                    pro.setData({
                        height: pro.height + this.calcRotateDraggablePort(drag, pro.rotate, "b"),
                    });
                    pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (pro.immobilizationData.width / pro.immobilizationData.height) * pro.height
                            : pro.immobilizationData.width,
                    });
                    pro.setData({
                        left: Math.round(
                            pro.immobilizationData.left -
                                this.calcSinOffset(pro, "height") -
                                this.calcCosOffsetReducOne(pro, "width")
                        ),
                        top: Math.round(
                            pro.immobilizationData.top -
                                this.calcCosOffsetReducOne(pro, "height") +
                                this.calcSinOffset(pro, "width")
                        ),
                    });
                },
                lt: () => {
                    const calcWidth = pro.width + this.calcRotateDraggablePort(drag, pro.rotate, "l");
                    pro.setData({
                        height: pro.height + this.calcRotateDraggablePort(drag, pro.rotate, "t"),
                    });
                    pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (pro.immobilizationData.width / pro.immobilizationData.height) * pro.height
                            : calcWidth,
                    });
                    pro.setData({
                        left: Math.round(
                            pro.immobilizationData.left -
                                this.calcCosOffset(pro, "width") +
                                this.calcSinOffset(pro, "height")
                        ),
                        top: Math.round(
                            pro.immobilizationData.top -
                                this.calcSinOffset(pro, "width") -
                                this.calcCosOffset(pro, "height")
                        ),
                    });
                },
                rt: () => {
                    const calcWidth = pro.width + this.calcRotateDraggablePort(drag, pro.rotate, "r");
                    pro.setData({
                        height: pro.height + this.calcRotateDraggablePort(drag, pro.rotate, "t"),
                    });
                    pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (pro.immobilizationData.width / pro.immobilizationData.height) * pro.height
                            : calcWidth,
                    });
                    pro.setData({
                        left: Math.round(
                            pro.immobilizationData.left -
                                this.calcCosOffsetReducOne(pro, "width") +
                                this.calcSinOffset(pro, "height")
                        ),
                        top: Math.round(
                            pro.immobilizationData.top +
                                this.calcSinOffset(pro, "width") -
                                this.calcCosOffset(pro, "height")
                        ),
                    });
                },
                rb: () => {
                    const calcWidth = pro.width + this.calcRotateDraggablePort(drag, pro.rotate, "r");
                    pro.setData({
                        height: pro.height + this.calcRotateDraggablePort(drag, pro.rotate, "b"),
                    });
                    pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (pro.immobilizationData.width / pro.immobilizationData.height) * pro.height
                            : calcWidth,
                    });
                    pro.setData({
                        left: Math.round(
                            pro.immobilizationData.left -
                                this.calcSinOffset(pro, "height") -
                                this.calcCosOffsetReducOne(pro, "width")
                        ),
                        top: Math.round(
                            pro.immobilizationData.top -
                                this.calcCosOffsetReducOne(pro, "height") +
                                this.calcSinOffset(pro, "width")
                        ),
                    });
                },
                lb: () => {
                    const calcWidth = pro.width + this.calcRotateDraggablePort(drag, pro.rotate, "l");
                    pro.setData({
                        height: pro.height + this.calcRotateDraggablePort(drag, pro.rotate, "b"),
                    });
                    pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (pro.immobilizationData.width / pro.immobilizationData.height) * pro.height
                            : calcWidth,
                    });
                    pro.setData({
                        left: Math.round(
                            pro.immobilizationData.left -
                                this.calcSinOffset(pro, "height") -
                                this.calcCosOffset(pro, "width")
                        ),
                        top: Math.round(
                            pro.immobilizationData.top -
                                this.calcCosOffsetReducOne(pro, "height") -
                                this.calcSinOffset(pro, "width")
                        ),
                    });
                },
            };
            if (objCur[corner.cursor]) {
                objCur[corner.cursor]();
                insetWidget.forEach(e => {
                    this.handleInsetWidgetPositionProportion(e);
                });
            }
        }
        // 重新计算主轮廓的大小和位置
        this.handleCalcProfileOuterSphere(drag);
        // 如果有文本设置的组件则改变文本设置的状态
        insetWidget.forEach(w => {
            if (w.panelTextModel) {
                setTimeout(() => {
                    const textStyle = w.panelTextModel.styleContent(w.conventionSiteModel.height);
                    w.addStyleToUltimatelyStyle(textStyle);
                });
            }
        });
    }
}
