import { BaseValueChangeClass } from "app/base-class";

/**
 * 动画效果数据模型
 */
export class PanelAnimationModel extends BaseValueChangeClass<PanelAnimationModel> {
	// 动效名称
	private _animationName: string = "none";
	public get animationName(): string {
		return this._animationName;
	}
	public set animationName(v: string) {
		this._animationName = v;
		this.valueChange$.next(this);
	}

	// 延时时间
	private _animationDelay: string = "0";
	public get animationDelay(): string {
		return this._animationDelay;
	}
	public set animationDelay(v: string) {
		this._animationDelay = v;
		this.valueChange$.next(this);
	}

	// 时长
	private _animationDuration: string = "2";
	public get animationDuration(): string {
		return this._animationDuration;
	}
	public set animationDuration(v: string) {
		this._animationDuration = v;
		this.valueChange$.next(this);
	}

	// 重复次数
	private _animationIterationCount: string = "1";
	public get animationIterationCount(): string {
		return this._animationIterationCount;
	}
	public set animationIterationCount(v: string) {
		this._animationIterationCount = v;
		this.valueChange$.next(this);
	}

	constructor() {
		super();
	}

	/**
	 * 重置数据
	 */
	public resetData(): void {
		this.animationName = "none";
		this.animationDelay = "0";
		this.animationDuration = "2";
		this.animationIterationCount = "1";
	}

	/**
	 * 赋值
	 */
	public setData(data: {
		animationName?: string;
		animationDelay?: string;
		animationDuration?: string;
		animationIterationCount?: string;
	}): void {
		if (!data) return;

		if ((<Object>data).hasOwnProperty("animationName")) this.animationName = data.animationName;
		if ((<Object>data).hasOwnProperty("animationDelay")) this.animationDelay = data.animationDelay;
		if ((<Object>data).hasOwnProperty("animationDuration")) this.animationDuration = data.animationDuration;
		if ((<Object>data).hasOwnProperty("animationIterationCount"))
			this.animationIterationCount = data.animationIterationCount;
	}

	/**
	 * 获取所有值
	 */
	public getValue(): {
		animationName?: string;
		animationDelay?: string;
		animationDuration?: string;
		animationIterationCount?: string;
	} {
		return {
			animationName: this.animationName,
			animationDelay: this.animationDelay,
			animationDuration: this.animationDuration,
			animationIterationCount: this.animationIterationCount
		};
	}

	// 效果展示的样式
	public get showStyleContent(): { [key: string]: string } {
		return {
			"animation-name": `${this.animationName}`,
			"animation-duration": `${this.animationDuration}s`
		};
	}

	// 映射在组件的样式

	public get styleContent(): { [key: string]: string } {
		return {
			"animation-name": this.animationName,
			"animation-duration": `${this.animationDuration}s`,
			"animation-delay": `${this.animationDelay}s`,
			"animation-iteration-count": this.animationIterationCount
		};
	}
}
