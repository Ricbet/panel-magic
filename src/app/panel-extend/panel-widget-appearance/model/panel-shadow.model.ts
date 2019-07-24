import { BaseValueChangeClass } from "app/base-class";

interface IPanelShadowable {
    color?: string;
    x?: number;
    y?: number;
    fuzzy?: number;
    spread?: number;
}

/**
 * 阴影数据模型
 */
export class PanelShadowModel extends BaseValueChangeClass<PanelShadowModel> implements IPanelShadowable {
    private _color: string = "#000";
    private _x: number = 0;
    private _y: number = 0;
    private _fuzzy: number = 0;
    private _spread: number = 0;

    // 扩散
    public get spread(): number {
        return this._spread;
    }
    public set spread(v: number) {
        this._spread = v;
        this.valueChange$.next(this);
    }

    // 模糊
    public get fuzzy(): number {
        return this._fuzzy;
    }
    public set fuzzy(v: number) {
        this._fuzzy = v;
        this.valueChange$.next(this);
    }

    public get y(): number {
        return this._y;
    }
    public set y(v: number) {
        this._y = v;
        this.valueChange$.next(this);
    }

    public get x(): number {
        return this._x;
    }
    public set x(v: number) {
        this._x = v;
        this.valueChange$.next(this);
    }

    // 阴影颜色
    public get color(): string {
        return this._color;
    }
    public set color(v: string) {
        this._color = v;
        this.valueChange$.next(this);
    }

    constructor() {
        super();
    }

    /**
     * 初始化值
     */
    public resetData(): void {
        this.color = "#000";
        this.x = 0;
        this.y = 0;
        this.fuzzy = 0;
        this.spread = 0;
    }

    /**
     * 赋值
     */
    public setData(data: IPanelShadowable): void {
        if (!data) return;

        if ((<Object>data).hasOwnProperty("color")) this.color = data.color;
        if ((<Object>data).hasOwnProperty("x")) this.x = data.x;
        if ((<Object>data).hasOwnProperty("y")) this.y = data.y;
        if ((<Object>data).hasOwnProperty("fuzzy")) this.fuzzy = data.fuzzy;
        if ((<Object>data).hasOwnProperty("spread")) this.spread = data.spread;
    }

    /**
     * 获取所有值
     */
    public getValue(): IPanelShadowable {
        return {
            color: this.color,
            x: this.x,
            y: this.y,
            fuzzy: this.fuzzy,
            spread: this.spread,
        };
    }

    /**
     * 返回样式属性
     */
    public styleContent(): { [key: string]: string } {
        return {
            "box-shadow": `${this.x}px ${this.y}px ${this.fuzzy}px ${this.spread}px ${this.color}`,
        };
    }
}
