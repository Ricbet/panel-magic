import { BehaviorSubject, Subject } from "rxjs";
import { CombinationWidgetModel } from "./combination-widget.model";
import { BaseValueChangeClass } from "app/base-class";

export interface IFourBearingProportion {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface IProfileable<T> {
    left: number;
    top: number;
    width: number;
    height: number;
    rotate: number;
    opacity: number;
    zIndex: number;
    valueChange$: Subject<T>;
}

/**
 * 轮廓数据模型
 * 包括但不限于组件轮廓和最外层轮廓
 */
export class ProfileModel extends BaseValueChangeClass<ProfileModel> implements IProfileable<ProfileModel> {
    private _unit: "px" | "%" = "px";
    private _left: number = null;
    private _top: number = null;
    private _width: number = null;
    private _height: number = null;
    private _rotate: number = null;
    private _opacity: number = 100;
    private _zIndex: number = 0;

    /**
     * 若该组件是组合组件combination内的子集，则有该属性
     */
    public readonly combinationWidgetData$: BehaviorSubject<CombinationWidgetModel> = new BehaviorSubject<
        CombinationWidgetModel
    >(null);

    // 单位： px | %
    public get unit(): "px" | "%" {
        return this._unit;
    }
    public set unit(v: "px" | "%") {
        this._unit = v;
        this.valueChange$.next(this);
    }

    public get zIndex(): number {
        return this._zIndex;
    }
    public set zIndex(v: number) {
        this._zIndex = v;
        this.valueChange$.next(this);
    }

    public get left(): number {
        return this._left;
    }
    public set left(v: number) {
        this._left = v;
        this.valueChange$.next(this);
    }

    public get top(): number {
        return this._top;
    }
    public set top(v: number) {
        this._top = v;
        this.valueChange$.next(this);
    }

    public get width(): number {
        return this._width;
    }
    public set width(v: number) {
        this._width = v;
        this.valueChange$.next(this);
    }

    public get height(): number {
        return this._height;
    }
    public set height(v: number) {
        this._height = v;
        this.valueChange$.next(this);
    }

    public get rotate(): number {
        return this._rotate;
    }
    public set rotate(v: number) {
        this._rotate = v;
        this.valueChange$.next(this);
    }

    public get opacity(): number {
        return this._opacity;
    }
    public set opacity(v: number) {
        this._opacity = v;
        this.valueChange$.next(this);
    }

    /**
     * 设置源数据，不发射值的变化
     */
    public setSourceDataNoLaunch(data: {
        left?: number;
        top?: number;
        width?: number;
        height?: number;
        rotate?: number;
        opacity?: number;
        zIndex?: number;
    }): void {
        if (!data) return;

        if ((<Object>data).hasOwnProperty("left")) this._left = data.left;
        if ((<Object>data).hasOwnProperty("top")) this._top = data.top;
        if ((<Object>data).hasOwnProperty("rotate")) this._rotate = data.rotate;
        if ((<Object>data).hasOwnProperty("opacity")) this._opacity = data.opacity;
        if ((<Object>data).hasOwnProperty("zIndex")) this._zIndex = data.zIndex;
        if ((<Object>data).hasOwnProperty("width")) this._width = Math.max(10, data.width);
        if ((<Object>data).hasOwnProperty("height")) this._height = Math.max(10, data.height);
    }

    /**
     * 该属性是用来标示如果主轮廓包含该组件，则记录该组件在主轮廓里的位置的比例
     * 分别有四个方位上、右、下、左
     */
    public insetProOuterSphereFourProportion: IFourBearingProportion = null;

    //	是否被选中
    public isCheck?: boolean = false;

    /**
     * 跟随鼠标移动的坐标点
     */
    public mouseCoord?: [number, number] = null;

    /**
     * 某一时刻需要固定的位置和大小等轮廓信息
     */
    public immobilizationData: {
        left: number;
        top: number;
        width: number;
        height: number;
        rotate: number;
        opacity: number;
        zIndex: number;
    } = null;

    constructor() {
        super();
    }

    /**
     * 生成固定轮廓信息
     */
    public recordImmobilizationData(): void {
        this.immobilizationData = {
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height,
            rotate: this.rotate,
            opacity: this.opacity,
            zIndex: this.zIndex,
        };
    }
    /**
     * 清空固定值
     */
    public removeImmobilizationData(): void {
        this.immobilizationData = null;
    }

    public setMouseCoord([x, y]: [number, number]): void {
        this.mouseCoord = [x, y];
    }
    public removeMouseCoord(): void {
        this.mouseCoord = null;
    }

    public reset() {
        this.unit = "px";
        this.left = null;
        this.top = null;
        this.width = null;
        this.height = null;
        this.rotate = null;
        this.isCheck = false;
        this.zIndex = 0;
    }

    // 返回样式
    public get styleContent(): { [key: string]: string } {
        if (this.width == null || this.height == null) {
            return { display: "none" };
        } else {
            return {
                left: `${this.left}${this.unit}`,
                top: `${this.top}${this.unit}`,
                width: `${this.width}${this.unit}`,
                height: `${this.height}${this.unit}`,
                transform: `rotate(${this.rotate}deg)`,
                opacity: `${this.opacity / 100}`,
                "z-index": `${this.zIndex}`,
            };
        }
    }

    /**
     * 设置数据
     */
    public setData(data: {
        unit?: "px" | "%";
        left?: number;
        top?: number;
        width?: number;
        height?: number;
        rotate?: number;
        isCheck?: boolean;
        opacity?: number;
        zIndex?: number;
    }): this {
        if (!data) return this;

        if ((<Object>data).hasOwnProperty("left")) this.left = data.left;
        if ((<Object>data).hasOwnProperty("top")) this.top = data.top;
        if ((<Object>data).hasOwnProperty("rotate")) this.rotate = data.rotate;
        if ((<Object>data).hasOwnProperty("opacity")) this.opacity = data.opacity;
        if ((<Object>data).hasOwnProperty("zIndex")) this.zIndex = data.zIndex;
        if ((<Object>data).hasOwnProperty("width")) this.width = Math.max(10, data.width);
        if ((<Object>data).hasOwnProperty("height")) this.height = Math.max(10, data.height);
        if ((<Object>data).hasOwnProperty("isCheck")) this.isCheck = !!data.isCheck;

        return this;
    }

    /**
     * 根据传入的主轮廓数据计算该组件在主轮廓里的位置比例
     */
    public recordInsetProOuterSphereFourProportion(pro: ProfileModel, widget: ProfileModel = this): void {
        this.insetProOuterSphereFourProportion = {
            left: (widget.left - pro.left) / pro.width,
            top: (widget.top - pro.top) / pro.height,
            right: (widget.left - pro.left + widget.width) / pro.width,
            bottom: Math.abs(widget.top - pro.top + widget.height) / pro.height,
        };
    }

    public removeInsetProOuterSphereFourProportion(): void {
        this.insetProOuterSphereFourProportion = null;
    }
}
