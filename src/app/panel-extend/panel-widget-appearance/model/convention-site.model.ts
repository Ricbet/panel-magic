import { Subject } from "rxjs";
import { BaseValueChangeClass } from "app/base-class";
import { toInteger } from "@ng-public/util";

// 左对齐、顶部对齐、右对齐、底部对齐、纵向居中、横向居中、水平等距、垂直等距
export type alignType =
    | "left"
    | "top"
    | "right"
    | "bottom"
    | "center"
    | "trancenter"
    | "crosswiseEquidistance"
    | "verticalEquidistance";

export class ConventionSiteModel extends BaseValueChangeClass<ConventionSiteModel> {
    private _alignType: alignType;
    private _opacity: number = 100;
    private _left: number = null;
    private _top: number = null;
    private _width: number = null;
    private _height: number = null;
    private _rotate: number = null;

    public get alignType(): alignType {
        return this._alignType;
    }
    public set alignType(v: alignType) {
        this._alignType = v;
        this.valueChange$.next(this);
    }

    public get opacity(): number {
        return this._opacity;
    }
    public set opacity(v: number) {
        this._opacity = v;
        this.valueChange$.next(this);
    }

    public get left(): number {
        return toInteger(this._left);
    }
    public set left(v: number) {
        this._left = v;
        this.valueChange$.next(this);
    }

    public get top(): number {
        return toInteger(this._top);
    }
    public set top(v: number) {
        this._top = v;
        this.valueChange$.next(this);
    }

    public get width(): number {
        return toInteger(this._width);
    }
    public set width(v: number) {
        this._width = v;
        this.valueChange$.next(this);
    }

    public get height(): number {
        return toInteger(this._height);
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

    constructor() {
        super();
    }

    /**
     * 初始化
     */
    public reset(): void {
        this.opacity = 100;
        this.left = null;
        this.top = null;
        this.width = null;
        this.height = null;
        this.rotate = null;
    }

    /**
     * 设置初始值
     */
    public setData(data: {
        opacity?: number;
        left?: number;
        top?: number;
        width?: number;
        height?: number;
        rotate?: number;
    }): void {
        if (!data) return;

        if ("opacity" in data) this.opacity = data.opacity;
        if ("left" in data) this.left = data.left;
        if ("top" in data) this.top = data.top;
        if ("width" in data) this.width = data.width;
        if ("height" in data) this.height = data.height;
        if ("rotate" in data) this.rotate = data.rotate;
    }

    /**
     * 获取基础值
     */
    public get valueKeys(): {
        opacity: number;
        left: number;
        top: number;
        width: number;
        height: number;
        rotate: number;
    } {
        return {
            opacity: this.opacity == null ? this.opacity : this.opacity * 1,
            left: this.left == null ? this.left : this.left * 1,
            top: this.top == null ? this.top : this.top * 1,
            width: this.width == null ? this.width : this.width * 1,
            height: this.height == null ? this.height : this.height * 1,
            rotate: this.rotate == null ? this.rotate : this.rotate * 1,
        };
    }
}
