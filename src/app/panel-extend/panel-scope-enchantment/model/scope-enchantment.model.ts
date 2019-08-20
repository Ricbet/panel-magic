import { BehaviorSubject } from "rxjs";
import { ProfileModel } from "./profile.model";
import { PanelWidgetModel } from "../../panel-widget/model";
import { CornerPinModel, CCursorStyle } from "./corner-pin.model";
import { OuterSphereHasAuxlModel } from "./outer-sphere-has-auxl.model";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";

/**
 * 此类非常重要
 *
 * 它是描述组件的可编辑选项内容，选中的任何组件都被该类继承，以实现更为复杂的样式编辑操作
 *
 */
export class ScopeEnchantmentModel {
    // 最外层的主轮廓,有且只能有一个
    public profileOuterSphere$: BehaviorSubject<OuterSphereHasAuxlModel> = new BehaviorSubject(null);
    // 鼠标移入呈现的轮廓,有且只能有一个
    public profileTemporary$: BehaviorSubject<ProfileModel> = new BehaviorSubject(null);
    // 主轮廓里面的所有被选组件列表
    public outerSphereInsetWidgetList$: BehaviorSubject<Array<PanelWidgetModel>> = new BehaviorSubject([]);

    // 八个拖拽点
    public cornerPinList$: BehaviorSubject<Array<CornerPinModel>> = new BehaviorSubject([]);
    // 八个位置点
    public cornerLocationPinList$: BehaviorSubject<Array<CornerPinModel>> = new BehaviorSubject([]);
    // 八个位置对应的鼠标样式数组
    public curnerStyleCursorList$: BehaviorSubject<Array<string>> = new BehaviorSubject([]);

    constructor() {}

    /**
     * 获取最外层主轮廓profileOuterSphere$的value值
     */
    public get valueProfileOuterSphere(): OuterSphereHasAuxlModel {
        return this.profileOuterSphere$.value;
    }

    /**
     * 清除八个拖拽点
     */
    public emptyAllCornerPinList(): void {
        this.cornerPinList$.next([]);
        this.cornerLocationPinList$.next([]);
        this.curnerStyleCursorList$.next([]);
    }

    /**
     * 切换外层主轮廓的isCheck状态
     */
    public toggleProfileOuterSphereIsCheckStatus$(bool: boolean): void {
        const pro = this.valueProfileOuterSphere;
        if (pro) {
            pro.isCheck = bool;
            this.profileOuterSphere$.next(pro);
        }
    }

    /**
     * 重置profileTemporary$
     */
    public resetProfileTemporary$(): void {
        this.profileTemporary$.next(null);
    }

    /**
     * 重置outerSphereInsetWidgetList$
     */
    public resetOuterSphereInsetWidgetList$(): void {
        this.outerSphereInsetWidgetList$.value.map(_e => (_e.profileModel.isCheck = false));
        this.outerSphereInsetWidgetList$.next([]);
    }

    /**
     * 清空所有profileOuterSphere$选中状态
     */
    public emptyAllProfile(): void {
        this.profileOuterSphere$.next(null);
        this.profileTemporary$.next(null);
        this.resetOuterSphereInsetWidgetList$();
        this.cornerPinList$.next([]);
        this.cornerLocationPinList$.next([]);
    }

    /**
     * 赋值profileOuterSphere
     * 参数isLaunch表示是否允许发射数据源
     */
    public launchProfileOuterSphere(arg: OuterSphereHasAuxlModel, isLaunch: boolean): void {
        if (isLaunch == true) {
            this.profileOuterSphere$.next(arg);
        } else {
            this.valueProfileOuterSphere.setData({
                left: arg.left,
                top: arg.top,
                width: arg.width,
                height: arg.height,
            });
            this.valueProfileOuterSphere.isRotate = arg.isRotate;
            this.valueProfileOuterSphere.setMouseCoord(arg.mouseCoord);
        }
    }

    /**
     * 计算主轮廓的位置
     */
    public handleProfileOuterSphereLocationInsetWidget(increment: DraggablePort): void {
        const pro = this.valueProfileOuterSphere;
        pro.mouseCoord[0] += increment.left;
        pro.mouseCoord[1] += increment.top;
        pro.setData({
            left: pro.left + increment.left,
            top: pro.top + increment.top,
        });
    }

    /**
     * 根据主轮廓的位置计算轮廓内被选组件的位置
     */
    public handleLocationInsetWidget(
        increment: DraggablePort,
        allWidget: Array<PanelWidgetModel> = this.outerSphereInsetWidgetList$.value
    ): void {
        if (Array.isArray(allWidget)) {
            const pro = this.valueProfileOuterSphere;
            // 所有轮廓内的组件计算位置
            allWidget.forEach(w => {
                w.profileModel.mouseCoord[0] += increment.left;
                w.profileModel.mouseCoord[1] += increment.top;
                let obj = { left: w.profileModel.mouseCoord[0], top: w.profileModel.mouseCoord[1] };
                if (!(pro.lLine || pro.rLine || pro.vcLine)) {
                    obj.left = w.profileModel.mouseCoord[0];
                    pro.left = pro.mouseCoord[0];
                } else {
                    obj.left += pro.left - pro.mouseCoord[0];
                }
                if (!(pro.tLine || pro.bLine || pro.hcLine)) {
                    obj.top = w.profileModel.mouseCoord[1];
                    pro.top = pro.mouseCoord[1];
                } else {
                    obj.top += pro.top - pro.mouseCoord[1];
                }
                w.profileModel.setData(obj);
                /**
                 * 如果被选的所有组件当中有组合组件combination，则需要重新计算其子集的所有widget轮廓数值
                 */
                if (w.type == "combination") {
                    this.handleLocationInsetWidget(increment, w.autoWidget.content);
                }
            });
        }
    }

    /**
     * 生成八个方位点
     */
    public handleCreateErightCornerPin(): void {
        // 先生成八个手势点
        let cursors = Array.from({ length: 8 }, (e, i) => new CornerPinModel({ type: "cursor", cursor: i }));
        // 再生成八个位置点
        let location = Array.from({ length: 8 }, (e, i) => new CornerPinModel({ type: "location", location: i }));
        this.cornerPinList$.next(cursors);
        this.cornerLocationPinList$.next(location);
        this.curnerStyleCursorList$.next(CCursorStyle);
    }

    /**
     * 根据传入的角度改变八个拖拽点的位置
     * 分为米字形，分别在以下角度才需要把数组属性向左转移
     * 30 60 120 150 210 240 300 330
     */
    public handleCursorPinStyle(rotate: number): void {
        const moveObj = {
            0: rotate >= 0 && rotate < 30,
            1: rotate >= 30 && rotate < 60,
            2: rotate >= 60 && rotate < 120,
            3: rotate >= 120 && rotate < 150,
            4: rotate >= 150 && rotate < 210,
            5: rotate >= 210 && rotate < 240,
            6: rotate >= 240 && rotate < 300,
            7: rotate >= 300 && rotate < 330,
            8: rotate >= 300 && rotate < 360,
        };
        let currentMoveIndex: number = 0;
        for (let e in moveObj) {
            if (moveObj[e] == true) {
                currentMoveIndex = <number>(<any>e);
                break;
            }
        }
        let slicePin = CCursorStyle.slice(0, currentMoveIndex);
        let sliceEndPin = CCursorStyle.slice(currentMoveIndex, 8);
        this.curnerStyleCursorList$.next(sliceEndPin.concat(slicePin));
    }
}
