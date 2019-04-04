import { Subject } from "rxjs";
import { BaseValueChangeClass } from "app/base-class";

export type TBorderStyle = "solid" | "dashed" | "dotted" | "none";

interface IPanelFacadeable {
	bgColor?: string;
	borderColor?: string;
	borderStyle?: TBorderStyle;
	borderNumber?: number;
	ltRadius?: number;
	rtRadius?: number;
	lbRadius?: number;
	rbRadius?: number;
	isRadiusAssociated?: boolean;
}

/**
 * 外观设置
 */
export class PanelFacadeModel extends BaseValueChangeClass<PanelFacadeModel> implements IPanelFacadeable {
	private _bgColor: string = "";
	private _borderColor: string = "";
	private _borderStyle: TBorderStyle = "none";
	private _borderNumber: number = 0;
	private _ltRadius: number = 0;
	private _rtRadius: number = 0;
	private _lbRadius: number = 0;
	private _rbRadius: number = 0;
	private _isRadiusAssociated: boolean = false;

	// 半径是否联动
	public get isRadiusAssociated(): boolean {
		return this._isRadiusAssociated;
	}
	public set isRadiusAssociated(v: boolean) {
		this._isRadiusAssociated = v;
		this.valueChange$.next(this);
	}

	// 右下角半径
	public get rbRadius(): number {
		return this._rbRadius;
	}
	public set rbRadius(v: number) {
		this._rbRadius = v;
		this.valueChange$.next(this);
	}

	// 左下角半径
	public get lbRadius(): number {
		return this._lbRadius;
	}
	public set lbRadius(v: number) {
		this._lbRadius = v;
		this.valueChange$.next(this);
	}

	// 右上角半径
	public get rtRadius(): number {
		return this._rtRadius;
	}
	public set rtRadius(v: number) {
		this._rtRadius = v;
		this.valueChange$.next(this);
	}

	// 左上角半径
	public get ltRadius(): number {
		return this._ltRadius;
	}
	public set ltRadius(v: number) {
		this._ltRadius = v;
		this.valueChange$.next(this);
	}

	public get borderNumber(): number {
		return this._borderNumber;
	}
	public set borderNumber(v: number) {
		this._borderNumber = v;
		this.valueChange$.next(this);
	}

	public get borderStyle(): TBorderStyle {
		return this._borderStyle;
	}
	public set borderStyle(v: TBorderStyle) {
		this._borderStyle = v;
		this.valueChange$.next(this);
	}

	public get borderColor(): string {
		return this._borderColor;
	}
	public set borderColor(v: string) {
		this._borderColor = v;
		this.valueChange$.next(this);
	}

	// 背景色
	public get bgColor(): string {
		return this._bgColor;
	}
	public set bgColor(v: string) {
		this._bgColor = v;
		this.valueChange$.next(this);
	}

	constructor() {
		super();
	}

	/**
	 * 重置数据
	 */
	public resetData(): void {
		this.bgColor = "";
		this.borderColor = "";
		this.borderStyle = "solid";
		this.borderNumber = 0;
		this.ltRadius = 0;
		this.rtRadius = 0;
		this.lbRadius = 0;
		this.rbRadius = 0;
		this.isRadiusAssociated = false;
	}

	/**
	 * 赋值
	 */
	public setData(data: IPanelFacadeable): void {
		if (!data) return;

		if ((<Object>data).hasOwnProperty("bgColor")) this.bgColor = data.bgColor;
		if ((<Object>data).hasOwnProperty("borderColor")) this.borderColor = data.borderColor;
		if ((<Object>data).hasOwnProperty("borderStyle")) this.borderStyle = data.borderStyle;
		if ((<Object>data).hasOwnProperty("borderNumber")) this.borderNumber = data.borderNumber;
		if ((<Object>data).hasOwnProperty("ltRadius")) this.ltRadius = data.ltRadius;
		if ((<Object>data).hasOwnProperty("rtRadius")) this.rtRadius = data.rtRadius;
		if ((<Object>data).hasOwnProperty("lbRadius")) this.lbRadius = data.lbRadius;
		if ((<Object>data).hasOwnProperty("rbRadius")) this.rbRadius = data.rbRadius;
		if ((<Object>data).hasOwnProperty("isRadiusAssociated")) this.isRadiusAssociated = data.isRadiusAssociated;
	}

	/**
	 * 获取所有值
	 */
	public getValue(): IPanelFacadeable {
		return {
			bgColor: this.bgColor,
			borderColor: this.borderColor,
			borderStyle: this.borderStyle,
			borderNumber: this.borderNumber,
			ltRadius: this.ltRadius,
			rtRadius: this.rtRadius,
			lbRadius: this.lbRadius,
			rbRadius: this.rbRadius,
			isRadiusAssociated: this.isRadiusAssociated
		};
	}

	/**
	 * 返回样式数据
	 */

	public styleContent(): { [key: string]: string } {
		return {
			"background-color": this.bgColor,
			"border-color": this.borderColor,
			"border-style": this.borderStyle,
			"border-width": `${this.borderNumber}px`,
			"border-radius": `${this.ltRadius}px ${this.rtRadius}px ${this.rbRadius}px ${this.lbRadius}px`
		};
	}
}
