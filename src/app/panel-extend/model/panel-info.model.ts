import { Subject } from "rxjs";

/**
 * 主视图屏幕的页面信息数据模型
 */
export class PanelInfoModel {
    public readonly valueChange$: Subject<this> = new Subject<this>();

    public width: number = 414;
    public height: number = 736;
    public left: number = null;
    public top: number = null;
    public bottom: number = null;
    public right: number = null;
    // 背景色
    public bgColor: string = "";
    // 背景图
    public bgImg: string = "";

    // 是否正在改变高度
    public isChangeHeightNow: boolean = false;

    /**
     * 某一时刻需要固定的位置和大小等轮廓信息
     */
    public immobilizationData: {
        left: number;
        top: number;
        width: number;
        height: number;
        bottom: number;
        right: number;
    } = { left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0 };

    constructor() {}

    // 赋值
    public setData(data: DOMRect): void {
        if (!data) return;

        if ("width" in data) this.width = data.width;
        if ("height" in data) this.height = data.height;
        if ("left" in data) this.left = data.left;
        if ("top" in data) this.top = data.top;
        if ("bottom" in data) this.bottom = data.bottom;
        if ("right" in data) this.right = data.right;

        this.valueChange$.next(this);
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
            bottom: this.bottom,
            right: this.right,
        };
    }
    /**
     * 清空固定值
     */
    public removeImmobilizationData(): void {
        this.immobilizationData = null;
    }

    // 充满屏幕，适应于屏幕，拉伸并充满屏幕，居中，平铺

    // 返回背景色和背景图的样式
}
