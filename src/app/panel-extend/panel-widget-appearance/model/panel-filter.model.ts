import { Subject } from "rxjs";
import { BaseValueChangeClass } from "app/base-class";

interface IPanelFilterable {
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturate?: number;
    grayscale?: number;
    sepia?: number;
    hueRotate?: number;
    invert?: number;
}

/**
 * 滤镜数据模型
 */
export class PanelFilterModel extends BaseValueChangeClass<PanelFilterModel> implements IPanelFilterable {
    // 模糊
    private _blur: number = 0;
    public get blur(): number {
        return this._blur;
    }
    public set blur(v: number) {
        this._blur = v;
        this.valueChange$.next(this);
    }

    // 亮度
    private _brightness: number = 1;
    public get brightness(): number {
        return this._brightness;
    }
    public set brightness(v: number) {
        this._brightness = v;
        this.valueChange$.next(this);
    }

    // 对比度
    private _contrast: number = 1;
    public get contrast(): number {
        return this._contrast;
    }
    public set contrast(v: number) {
        this._contrast = v;
        this.valueChange$.next(this);
    }

    // 饱和度
    private _saturate: number = 1;
    public get saturate(): number {
        return this._saturate;
    }
    public set saturate(v: number) {
        this._saturate = v;
        this.valueChange$.next(this);
    }

    // 灰度
    private _grayscale: number = 0;
    public get grayscale(): number {
        return this._grayscale;
    }
    public set grayscale(v: number) {
        this._grayscale = v;
        this.valueChange$.next(this);
    }

    // 加温
    private _sepia: number = 0;
    public get sepia(): number {
        return this._sepia;
    }
    public set sepia(v: number) {
        this._sepia = v;
        this.valueChange$.next(this);
    }

    // 色相
    private _hueRotate: number = 0;
    public get hueRotate(): number {
        return this._hueRotate;
    }
    public set hueRotate(v: number) {
        this._hueRotate = v;
        this.valueChange$.next(this);
    }

    // 反色
    private _invert: number = 0;
    public get invert(): number {
        return this._invert;
    }
    public set invert(v: number) {
        this._invert = v;
        this.valueChange$.next(this);
    }

    constructor() {
        super();
    }

    /**
     * 重置
     */
    public resetData(): void {
        this.blur = 0;
        this.brightness = 1;
        this.contrast = 1;
        this.saturate = 1;
        this.grayscale = 0;
        this.sepia = 0;
        this.hueRotate = 0;
        this.invert = 0;
    }

    /**
     * 赋值
     */
    public setData(data: IPanelFilterable): void {
        if (!data) return;

        if ((<Object>data).hasOwnProperty("blur")) this.blur = data.blur;
        if ((<Object>data).hasOwnProperty("brightness")) this.brightness = data.brightness;
        if ((<Object>data).hasOwnProperty("contrast")) this.contrast = data.contrast;
        if ((<Object>data).hasOwnProperty("saturate")) this.saturate = data.saturate;
        if ((<Object>data).hasOwnProperty("grayscale")) this.grayscale = data.grayscale;
        if ((<Object>data).hasOwnProperty("sepia")) this.sepia = data.sepia;
        if ((<Object>data).hasOwnProperty("hueRotate")) this.hueRotate = data.hueRotate;
        if ((<Object>data).hasOwnProperty("invert")) this.invert = data.invert;
    }

    /**
     * 获取所有值
     */
    public getValue(): IPanelFilterable {
        return {
            blur: this.blur,
            brightness: this.brightness,
            contrast: this.contrast,
            saturate: this.saturate,
            grayscale: this.grayscale,
            sepia: this.sepia,
            hueRotate: this.hueRotate,
            invert: this.invert,
        };
    }

    /**
     * 返回样式
     */
    public styleContent(): { [key: string]: string } {
        return {
            filter: `blur(${this.blur}px) brightness(${this.brightness}) contrast(${this.contrast}) saturate(${
                this.saturate
            }) grayscale(${this.grayscale}) sepia(${this.sepia}) hue-rotate(${this.hueRotate}deg) invert(${
                this.invert
            })`,
        };
    }
}
