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
    public calcSinOffset = (pro: ProfileModel, type: "height" | "width"): number =>
        this.panelScopeEnchantmentService.calcNumSin((pro[type] - pro.immobilizationData[type]) / 2, pro.rotate);

    // 计算pro轮廓的cos偏移量
    public calcCosOffset = (pro: ProfileModel, type: "height" | "width"): number =>
        this.panelScopeEnchantmentService.calcNumCos((pro[type] - pro.immobilizationData[type]) / 2, pro.rotate) +
        (pro[type] - pro.immobilizationData[type]) / 2;

    // 计算pro轮廓的1-cos偏移量,用于计算right拉伸和bottom的拉伸计算
    public calcCosOffsetReducOne = (pro: ProfileModel, type: "height" | "width"): number =>
        ((1 - Math.cos(this.panelScopeEnchantmentService.conversionRotateToMathDegree(pro.rotate))) *
            (pro[type] - pro.immobilizationData[type])) /
        2;

    // 根据旋转角度计算DraggablePort鼠标坐标点返回的坐标点，使其在旋转到对应的角度之后，被拉伸的方向也一致
    public calcRotateDraggablePort(drag: DraggablePort, rotate: number, type: "l" | "t" | "r" | "b"): number {
        const _ = {
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
        return _[type] ? Math.round(_[type]) : 0;
    }

    /**
     * 调整被选中组件在主轮廓里的位置比例
     * 同时根据角度限制主轮廓完全包住被选组件
     */
    public handleInsetWidgetPositionProportion(wPro: PanelWidgetModel): void {
        const _pro = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
        if (wPro.profileModel.insetProOuterSphereFourProportion) {
            wPro.profileModel.left = _pro.width * wPro.profileModel.insetProOuterSphereFourProportion.left + _pro.left;
            wPro.profileModel.top = _pro.height * wPro.profileModel.insetProOuterSphereFourProportion.top + _pro.top;
            wPro.profileModel.width =
                _pro.width * wPro.profileModel.insetProOuterSphereFourProportion.right -
                wPro.profileModel.left +
                _pro.left;
            wPro.profileModel.height =
                _pro.height * wPro.profileModel.insetProOuterSphereFourProportion.bottom -
                wPro.profileModel.top +
                _pro.top;
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
        const _pro = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
        const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        if (_inset_widget.length > 1 && drag) {
            const _obj = this.panelScopeEnchantmentService.calcProfileOuterSphereInfo();
            _pro.setData({
                left: _obj.left,
                top: _obj.top,
                width: _obj.width,
                height: _obj.height,
            });
        }
    }

    /**
     * 接受八个拖拽点移动的回调
     */
    public acceptDraggableCursor(drag: DraggablePort, corner: CornerPinModel): void {
        const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        if (drag && corner.cursor != undefined) {
            const _pro = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
            const _obj_cur = {
                l: () => {
                    _pro.setData({
                        width: _pro.width + this.calcRotateDraggablePort(drag, _pro.rotate, "l"),
                    });
                    _pro.setData({
                        height: this.isOpenConstrainShift$.value
                            ? (_pro.immobilizationData.height / _pro.immobilizationData.width) * _pro.width
                            : _pro.immobilizationData.height,
                    });
                    _pro.setData({
                        left: Math.round(
                            _pro.immobilizationData.left -
                                this.calcSinOffset(_pro, "height") -
                                this.calcCosOffset(_pro, "width")
                        ),
                        top: Math.round(
                            _pro.immobilizationData.top -
                                this.calcCosOffsetReducOne(_pro, "height") -
                                this.calcSinOffset(_pro, "width")
                        ),
                    });
                },
                t: () => {
                    _pro.setData({
                        height: _pro.height + this.calcRotateDraggablePort(drag, _pro.rotate, "t"),
                    });
                    _pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (_pro.immobilizationData.width / _pro.immobilizationData.height) * _pro.height
                            : _pro.immobilizationData.width,
                    });
                    _pro.setData({
                        left: Math.round(
                            _pro.immobilizationData.left -
                                this.calcCosOffsetReducOne(_pro, "width") +
                                this.calcSinOffset(_pro, "height")
                        ),
                        top: Math.round(
                            _pro.immobilizationData.top +
                                this.calcSinOffset(_pro, "width") -
                                this.calcCosOffset(_pro, "height")
                        ),
                    });
                },
                r: () => {
                    _pro.setData({
                        width: _pro.width + this.calcRotateDraggablePort(drag, _pro.rotate, "r"),
                    });
                    _pro.setData({
                        height: this.isOpenConstrainShift$.value
                            ? (_pro.immobilizationData.height / _pro.immobilizationData.width) * _pro.width
                            : _pro.immobilizationData.height,
                    });
                    _pro.setData({
                        left: Math.round(
                            _pro.immobilizationData.left -
                                this.calcSinOffset(_pro, "height") -
                                this.calcCosOffsetReducOne(_pro, "width")
                        ),
                        top: Math.round(
                            _pro.immobilizationData.top -
                                this.calcCosOffsetReducOne(_pro, "height") +
                                this.calcSinOffset(_pro, "width")
                        ),
                    });
                },
                b: () => {
                    _pro.setData({
                        height: _pro.height + this.calcRotateDraggablePort(drag, _pro.rotate, "b"),
                    });
                    _pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (_pro.immobilizationData.width / _pro.immobilizationData.height) * _pro.height
                            : _pro.immobilizationData.width,
                    });
                    _pro.setData({
                        left: Math.round(
                            _pro.immobilizationData.left -
                                this.calcSinOffset(_pro, "height") -
                                this.calcCosOffsetReducOne(_pro, "width")
                        ),
                        top: Math.round(
                            _pro.immobilizationData.top -
                                this.calcCosOffsetReducOne(_pro, "height") +
                                this.calcSinOffset(_pro, "width")
                        ),
                    });
                },
                lt: () => {
                    const _calc_width = _pro.width + this.calcRotateDraggablePort(drag, _pro.rotate, "l");
                    _pro.setData({
                        height: _pro.height + this.calcRotateDraggablePort(drag, _pro.rotate, "t"),
                    });
                    _pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (_pro.immobilizationData.width / _pro.immobilizationData.height) * _pro.height
                            : _calc_width,
                    });
                    _pro.setData({
                        left: Math.round(
                            _pro.immobilizationData.left -
                                this.calcCosOffset(_pro, "width") +
                                this.calcSinOffset(_pro, "height")
                        ),
                        top: Math.round(
                            _pro.immobilizationData.top -
                                this.calcSinOffset(_pro, "width") -
                                this.calcCosOffset(_pro, "height")
                        ),
                    });
                },
                rt: () => {
                    const _calc_width = _pro.width + this.calcRotateDraggablePort(drag, _pro.rotate, "r");
                    _pro.setData({
                        height: _pro.height + this.calcRotateDraggablePort(drag, _pro.rotate, "t"),
                    });
                    _pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (_pro.immobilizationData.width / _pro.immobilizationData.height) * _pro.height
                            : _calc_width,
                    });
                    _pro.setData({
                        left: Math.round(
                            _pro.immobilizationData.left -
                                this.calcCosOffsetReducOne(_pro, "width") +
                                this.calcSinOffset(_pro, "height")
                        ),
                        top: Math.round(
                            _pro.immobilizationData.top +
                                this.calcSinOffset(_pro, "width") -
                                this.calcCosOffset(_pro, "height")
                        ),
                    });
                },
                rb: () => {
                    const _calc_width = _pro.width + this.calcRotateDraggablePort(drag, _pro.rotate, "r");
                    _pro.setData({
                        height: _pro.height + this.calcRotateDraggablePort(drag, _pro.rotate, "b"),
                    });
                    _pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (_pro.immobilizationData.width / _pro.immobilizationData.height) * _pro.height
                            : _calc_width,
                    });
                    _pro.setData({
                        left: Math.round(
                            _pro.immobilizationData.left -
                                this.calcSinOffset(_pro, "height") -
                                this.calcCosOffsetReducOne(_pro, "width")
                        ),
                        top: Math.round(
                            _pro.immobilizationData.top -
                                this.calcCosOffsetReducOne(_pro, "height") +
                                this.calcSinOffset(_pro, "width")
                        ),
                    });
                },
                lb: () => {
                    const _calc_width = _pro.width + this.calcRotateDraggablePort(drag, _pro.rotate, "l");
                    _pro.setData({
                        height: _pro.height + this.calcRotateDraggablePort(drag, _pro.rotate, "b"),
                    });
                    _pro.setData({
                        width: this.isOpenConstrainShift$.value
                            ? (_pro.immobilizationData.width / _pro.immobilizationData.height) * _pro.height
                            : _calc_width,
                    });
                    _pro.setData({
                        left: Math.round(
                            _pro.immobilizationData.left -
                                this.calcSinOffset(_pro, "height") -
                                this.calcCosOffset(_pro, "width")
                        ),
                        top: Math.round(
                            _pro.immobilizationData.top -
                                this.calcCosOffsetReducOne(_pro, "height") -
                                this.calcSinOffset(_pro, "width")
                        ),
                    });
                },
            };
            if (_obj_cur[corner.cursor]) {
                _obj_cur[corner.cursor]();
                _inset_widget.forEach(_e => {
                    this.handleInsetWidgetPositionProportion(_e);
                });
            }
        }
        // 重新计算主轮廓的大小和位置
        this.handleCalcProfileOuterSphere(drag);
        // 如果有文本设置的组件则改变文本设置的状态
        _inset_widget.forEach(_w => {
            if (_w.panelTextModel) {
                setTimeout(() => {
                    const _text_style = _w.panelTextModel.styleContent(_w.conventionSiteModel.height);
                    _w.addStyleToUltimatelyStyle(_text_style);
                });
            }
        });
    }
}
