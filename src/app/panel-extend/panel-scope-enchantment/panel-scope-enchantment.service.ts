import { Injectable } from "@angular/core";
import {
    ScopeEnchantmentModel,
    AuxliLineModel,
    PanelScopeTextEditorModel,
    ProfileModel,
    OuterSphereHasAuxlModel,
} from "./model";
import { PanelWidgetModel } from "../panel-widget/model";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class PanelScopeEnchantmentService {
    // 是否开启辅助线计算
    public isOpenAltCalc$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    // 订阅鼠标移动偏移量回调
    public launchMouseIncrement$: Subject<DraggablePort> = new Subject<DraggablePort>();
    // 订阅组件的右键事件
    public launchContextmenu$: BehaviorSubject<MouseEvent> = new BehaviorSubject<MouseEvent>(null);

    public scopeEnchantmentModel: ScopeEnchantmentModel = new ScopeEnchantmentModel();
    // 文字编辑器模式数据模型
    public panelScopeTextEditorModel$: BehaviorSubject<PanelScopeTextEditorModel> = new BehaviorSubject(null);
    // 存储所有辅助线的数据模型
    public auxliLineModel$: BehaviorSubject<AuxliLineModel> = new BehaviorSubject<AuxliLineModel>(new AuxliLineModel());
    // 存储粘贴板的组件内容
    public clipboardList$: BehaviorSubject<Array<PanelWidgetModel>> = new BehaviorSubject([]);

    constructor() {}

    /**
     * 根据传入的widget参数设置鼠标移入的轮廓绘制
     */
    public handleTemporaryProfile(widget: PanelWidgetModel, type: "enter" | "out"): void {
        if (type == "enter") {
            this.scopeEnchantmentModel.profileTemporary$.next(widget.profileModel);
        } else if (type == "out") {
            this.scopeEnchantmentModel.resetProfileTemporary$();
        }
    }

    /**
     * 只选中某一个组件传入到列表outerSphereInsetWidgetList$列表中
     */
    public onlyOuterSphereInsetWidget(widget: PanelWidgetModel): void {
        this.scopeEnchantmentModel.resetOuterSphereInsetWidgetList$();
        this.scopeEnchantmentModel.outerSphereInsetWidgetList$.next([widget]);
        this.handleFromWidgetListToProfileOuterSphere();
    }

    /**
     * 根据传入的outerSphereInsetWidgetList$数组进行处理选中状态
     */
    public pushOuterSphereInsetWidget(widgets: Array<PanelWidgetModel>): void {
        this.scopeEnchantmentModel.resetOuterSphereInsetWidgetList$();
        this.scopeEnchantmentModel.outerSphereInsetWidgetList$.next(widgets);
        this.handleFromWidgetListToProfileOuterSphere();
    }

    /**
     * 如果存在outerSphereInsetWidgetList$列表中就去除否则就增加
     */
    public toggleOuterSphereInsetWidget(widget: PanelWidgetModel): void {
        const outerWidthList = this.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        const arrUniqueid = this.scopeEnchantmentModel.outerSphereInsetWidgetList$.value.map(e => e.uniqueId);
        if (!arrUniqueid.includes(widget.uniqueId)) {
            outerWidthList.push(widget);
            this.scopeEnchantmentModel.outerSphereInsetWidgetList$.next(outerWidthList);
        } else {
            const filter = outerWidthList.filter(e => e.uniqueId != widget.uniqueId);
            widget.profileModel.isCheck = false;
            this.scopeEnchantmentModel.outerSphereInsetWidgetList$.next(filter);
        }
        this.handleFromWidgetListToProfileOuterSphere();
    }

    /**
     * 处理由outerSphereInsetWidgetList$列表内的组件变化来描绘主轮廓
     * isLaunch参数表示是否发送数据源
     */
    public handleFromWidgetListToProfileOuterSphere(arg: { isLaunch?: boolean } = { isLaunch: true }): void {
        const oriArr = this.scopeEnchantmentModel.outerSphereInsetWidgetList$.value.map(e => {
            e.profileModel.isCheck = true;
            // 根据当前位置重新设置mousecoord
            e.profileModel.setMouseCoord([e.profileModel.left, e.profileModel.top]);
            return e.profileModel;
        });
        if (oriArr.length > 0) {
            // 计算出最小的left,最小的top，最大的width和height
            const calcResult = this.calcProfileOuterSphereInfo();
            // 如果insetWidget数量大于一个则不允许开启旋转,且旋转角度重置
            if (oriArr.length == 1) {
                calcResult.isRotate = true;
                calcResult.rotate = oriArr[0].rotate;
            } else {
                calcResult.isRotate = false;
            }
            // 赋值
            this.scopeEnchantmentModel.launchProfileOuterSphere(calcResult, arg.isLaunch);
            // 同时生成八个方位坐标点，如果被选组件大于一个则不生成
            this.scopeEnchantmentModel.handleCreateErightCornerPin();
        }
    }

    /**
     * 从被选组件当中计算出主轮廓的大小和位置
     */
    public calcProfileOuterSphereInfo(): OuterSphereHasAuxlModel {
        const insetWidget = this.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        let outerSphere = new OuterSphereHasAuxlModel().setData({
            left: Infinity,
            top: Infinity,
            width: -Infinity,
            height: -Infinity,
            rotate: 0,
        });
        let maxWidth = null;
        let maxHeight = null;
        let minWidthEmpty = Infinity;
        let minHeightEmpty = Infinity;
        insetWidget.forEach(e => {
            let offsetCoord = { left: 0, top: 0 };
            if (e.profileModel.rotate != 0 && insetWidget.length > 1) {
                offsetCoord = this.handleOuterSphereRotateOffsetCoord(e.profileModel);
            }

            outerSphere.left = Math.min(outerSphere.left, e.profileModel.left + offsetCoord.left);
            outerSphere.top = Math.min(outerSphere.top, e.profileModel.top + offsetCoord.top);

            maxWidth = Math.max(maxWidth, e.profileModel.left + e.profileModel.width + offsetCoord.left * -1);
            maxHeight = Math.max(maxHeight, e.profileModel.top + e.profileModel.height + offsetCoord.top * -1);

            if (e.profileModel.left + e.profileModel.width < 0) {
                minWidthEmpty = Math.min(minWidthEmpty, Math.abs(e.profileModel.left) - e.profileModel.width);
            } else {
                minWidthEmpty = 0;
            }

            if (e.profileModel.top + e.profileModel.height < 0) {
                minHeightEmpty = Math.min(minHeightEmpty, Math.abs(e.profileModel.top) - e.profileModel.height);
            } else {
                minHeightEmpty = 0;
            }
        });

        outerSphere.width = Math.abs(maxWidth - outerSphere.left) - minWidthEmpty;
        outerSphere.height = Math.abs(maxHeight - outerSphere.top) - minHeightEmpty;
        outerSphere.setMouseCoord([outerSphere.left, outerSphere.top]);

        return outerSphere;
    }

    /**
     * 根据角度计算offsetcoord坐标的增量，用于辅助线计算
     * type 表示计算并返回左上、右上、左下还是右下的坐标点
     */
    public handleOuterSphereRotateOffsetCoord(
        arg: ProfileModel,
        type: "lt" | "rt" | "lb" | "rb" = "lt"
    ): { left: number; top: number } | undefined {
        const fourCoord = this.conversionRotateToOffsetLeftTop({
            width: arg.width,
            height: arg.height,
            rotate: arg.rotate,
        });
        if (fourCoord) {
            let min = Infinity;
            let max = -Infinity;
            for (let e in fourCoord) {
                min = Math.min(min, fourCoord[e][0]);
                max = Math.max(max, fourCoord[e][1]);
            }
            const typeObj = {
                lt: [min, max],
                rt: [-min, max],
                lb: [min, -max],
                rb: [-min, -max],
            };
            if (typeObj[type]) {
                return {
                    left: Math.round(arg.width / 2 + typeObj[type][0]),
                    top: Math.round(arg.height / 2 - typeObj[type][1]),
                };
            }
        }
        return;
    }

    /**
     * 计算辅助线的显示与否情况
     * 分为6种情况
     * 辅助线只会显示在主轮廓的4条边以及2条中线
     * 遍历时先寻找离四条边最近的4个数值
     * 参数target表示除了用于计算最外主轮廓以外还能计算其他的辅助线情况，（例如左侧的组件库里的待创建的组件）
     */
    public handleAuxlineCalculate(
        target: OuterSphereHasAuxlModel = this.scopeEnchantmentModel.valueProfileOuterSphere
    ): void {
        const outerSphere = target;
        const offsetAmount = outerSphere.offsetAmount;
        const aux = this.auxliLineModel$.value;
        const mouseCoord = outerSphere.mouseCoord;

        // 差量达到多少范围内开始对齐
        const diffNum: number = 4;

        outerSphere.resetAuxl();

        if (mouseCoord) {
            for (let i: number = 0, l: number = aux.vLineList.length; i < l; i++) {
                if (Math.abs(aux.vLineList[i] - mouseCoord[0] + offsetAmount.left * -1) <= diffNum) {
                    outerSphere.left = aux.vLineList[i] + offsetAmount.left * -1;
                    outerSphere.lLine = true;
                }
                if (Math.abs(aux.vLineList[i] - (mouseCoord[0] + outerSphere.width) + offsetAmount.left) <= diffNum) {
                    outerSphere.left = aux.vLineList[i] - outerSphere.width + offsetAmount.left;
                    outerSphere.rLine = true;
                }
                if (outerSphere.lLine == true && outerSphere.rLine == true) break;
            }
            for (let i: number = 0, l: number = aux.hLineList.length; i < l; i++) {
                if (Math.abs(aux.hLineList[i] - mouseCoord[1] + offsetAmount.top * -1) <= diffNum) {
                    outerSphere.top = aux.hLineList[i] + offsetAmount.top * -1;
                    outerSphere.tLine = true;
                }
                if (Math.abs(aux.hLineList[i] - (mouseCoord[1] + outerSphere.height) + offsetAmount.top) <= diffNum) {
                    outerSphere.top = aux.hLineList[i] - outerSphere.height + offsetAmount.top;
                    outerSphere.bLine = true;
                }
                if (outerSphere.tLine == true && outerSphere.bLine == true) break;
            }
            for (let i: number = 0, l: number = aux.hcLineList.length; i < l; i++) {
                if (Math.abs(aux.hcLineList[i] - (mouseCoord[1] + outerSphere.height / 2)) <= diffNum) {
                    outerSphere.top = aux.hcLineList[i] - outerSphere.height / 2;
                    outerSphere.hcLine = true;
                    break;
                }
            }
            for (let i: number = 0, l: number = aux.vcLineList.length; i < l; i++) {
                if (Math.abs(aux.vcLineList[i] - (mouseCoord[0] + outerSphere.width / 2)) <= diffNum) {
                    outerSphere.left = aux.vcLineList[i] - outerSphere.width / 2;
                    outerSphere.vcLine = true;
                    break;
                }
            }
        }
    }

    /**
     * 根据传入的角度和转化为横向的偏移量和纵向的偏移量，主要是用来计算旋转到一定角度之后辅助线的计算基线位置偏移
     * 以组件的中心点为坐标圆点，返回四个角的坐标，分别是左上角、右上角、左下角、右下角
     * 转化角公式为
     * x = x * Math.cos(r) + y * Math.sin(r)
     * y = y * Math.cos(r) - x * Math.sin(r)
     */
    public conversionRotateToOffsetLeftTop(arg: {
        width: number;
        height: number;
        rotate: number;
    }): {
        lt: number[];
        rt: number[];
        lb: number[];
        rb: number[];
    } {
        // 转化角度使其成0～360的范围
        arg.rotate = this.conversionRotateOneCircle(arg.rotate);
        let result = {
            lt: [(arg.width / 2) * -1, arg.height / 2],
            rt: [arg.width / 2, arg.height / 2],
            lb: [(arg.width / 2) * -1, (arg.height / 2) * -1],
            rb: [arg.width / 2, (arg.height / 2) * -1],
        };
        let convRotate = this.conversionRotateToMathDegree(arg.rotate);
        let calcX = (x, y) => <any>(x * Math.cos(convRotate) + y * Math.sin(convRotate)) * 1;
        let calcY = (x, y) => <any>(y * Math.cos(convRotate) - x * Math.sin(convRotate)) * 1;
        result.lt = [calcX(result.lt[0], result.lt[1]), calcY(result.lt[0], result.lt[1])];
        result.rt = [calcX(result.rt[0], result.rt[1]), calcY(result.rt[0], result.rt[1])];
        result.lb = [result.rt[0] * -1, result.rt[1] * -1];
        result.rb = [result.lt[0] * -1, result.lt[1] * -1];
        return result;
    }

    /**
     * 根据传入的坐标转化为度数，度数范围在0～360
     */
    public conversionTwoCoordToRotate(coord: [number, number]): number {
        if (!Array.isArray(coord) || coord.length != 2) return 0;

        const map: Map<boolean, number> = new Map();
        map.set(coord[0] >= 0 && coord[1] > 0, this.conversionRotateFromRadian(coord[0] / coord[1]));
        map.set(coord[0] > 0 && coord[1] <= 0, this.conversionRotateFromRadian((coord[1] / coord[0]) * -1) + 90);
        map.set(coord[0] <= 0 && coord[1] < 0, this.conversionRotateFromRadian(coord[0] / coord[1]) + 180);
        map.set(coord[0] < 0 && coord[1] >= 0, this.conversionRotateFromRadian((coord[1] / coord[0]) * -1) + 270);

        return ~~map.get(true);
    }

    /**
     * 根据传入的角度转化为0～360度的范围
     */
    public conversionRotateOneCircle(rotate: number): number {
        return rotate <= 0
            ? rotate + Math.ceil(Math.abs(rotate / 360)) * 360
            : rotate - Math.floor(Math.abs(rotate / 360)) * 360;
    }

    /**
     * 根据角度计算出在哪个象限里
     */
    public conversionRotateToQuadrant(rotate: number): number {
        rotate = this.conversionRotateOneCircle(rotate);

        const map: Map<boolean, 1 | 2 | 3 | 4> = new Map();
        map.set(rotate >= 0 && rotate < 90, 1);
        map.set(rotate >= 270 && rotate < 360, 2);
        map.set(rotate >= 180 && rotate < 270, 3);
        map.set(rotate >= 90 && rotate < 180, 4);

        return ~~map.get(true);
    }

    /**
     * 根据坐标和角度来计算该坐标旋转到该角度之后的差值增量
     */
    public conversionRotateNewCoordinates(
        coord: [number, number],
        rotate: number
    ): { left: number; top: number } | undefined {
        const quardPosition = { 1: "rt", 2: "lt", 3: "lb", 4: "rb" };
        const offsetCoord = this.conversionRotateToOffsetLeftTop({
            width: Math.abs(coord[0] * 2),
            height: Math.abs(coord[1] * 2),
            rotate: rotate,
        });
        const offsetCoordNumber = offsetCoord[quardPosition[this.conversionCoordinatesToQuadrant(coord)]];
        if (offsetCoordNumber) {
            return {
                left: offsetCoordNumber[0] - coord[0],
                top: coord[1] - offsetCoordNumber[1],
            };
        }
        return;
    }

    // rotate角度转化为数学里要用到的角度
    public conversionRotateToMathDegree(rotate: number): number {
        return (rotate * Math.PI) / 180;
    }

    // 转弧度为度数
    public conversionRotateFromRadian(x: number): number {
        return Math.floor((Math.atan(x) * 180) / Math.PI);
    }

    // 根据坐标计算出在哪个象限里
    public conversionCoordinatesToQuadrant(coord: [number, number]): number {
        return this.conversionRotateToQuadrant(this.conversionTwoCoordToRotate(coord));
    }

    // 根据传入的数值和角度计算对应的sin值
    public calcNumSin(num: number, rotate: number): number {
        return Math.sin(this.conversionRotateToMathDegree(rotate)) * num;
    }

    // 根据传入的数值和角度计算对应的cos值
    public calcNumCos(num: number, rotate: number): number {
        return Math.cos(this.conversionRotateToMathDegree(rotate)) * num;
    }
}
