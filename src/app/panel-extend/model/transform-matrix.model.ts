import { Subject, Observable } from "rxjs";

//  监听视图区域矩阵的数据模型
/**
 *	其中transform的matrix属性有六个值
 *  分别是 transform：matrix（ cosθ，sinθ, -sinθ, cosθ, translateX, translateY )
 *  前期只计算后面两个，前面那些鬼就先不管
 * @export
 * @class TransformMatrixModel
 */
export class TransformMatrixModel {
    public readonly valueChange$: Subject<this> = new Subject<this>();

    private _translateX: number = 0;
    private _translateY: number = 0;
    public cos: number = 1;
    public minusCos: number = 0;
    public sin: number = 0;

    public get translateX(): number {
        return this._translateX;
    }
    public set translateX(v: number) {
        this._translateX = v;
        this.valueChange$.next(this);
    }
    public get translateY(): number {
        return this._translateY;
    }
    public set translateY(v: number) {
        this._translateY = v;
        this.valueChange$.next(this);
    }

    constructor() {}

    /**
     * 返回转换偏移量
     */
    public get matrix(): { transform: string } {
        return { transform: `translate(${this.translateX}px,${this.translateY}px)` };
    }

    /**
     * 重置
     */
    public reset(): void {
        this.translateX = 0;
        this.translateY = 0;
        this.minusCos = 0;
        this.sin = 0;
        this.cos = 0;
    }
}
