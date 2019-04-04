import { ProfileModel } from "./profile.model";

/**
 * 最外层主轮廓的拓展类
 * 具有描绘辅助线的属性
 * 有6个方向的辅助线
 */
export class OuterSphereHasAuxlModel extends ProfileModel {
	// 此变量用来记录因旋转之后需要减去或增加的偏移量，使其辅助线计算能对准边角线
	public offsetAmount: { left: number; top: number } = { left: 0, top: 0 };

	public lLine: boolean = false;
	public tLine: boolean = false;
	public rLine: boolean = false;
	public bLine: boolean = false;
	// 竖线中线
	public vcLine: boolean = false;
	// 横线中线
	public hcLine: boolean = false;
	// 是否允许旋转
	public isRotate: boolean = false;
	constructor() {
		super();
	}
	public resetAuxl(): void {
		this.lLine = false;
		this.tLine = false;
		this.rLine = false;
		this.bLine = false;
		this.vcLine = false;
		this.hcLine = false;
	}
	/**
	 * 赋值offsetAmount
	 */
	public setOffsetAmount(arg: { left: number; top: number }): void {
		(this.offsetAmount.left = arg.left), (this.offsetAmount.top = arg.top);
	}
	/**
	 * 重置offsetAmount
	 */
	public resetOffsetAmount(): void {
		this.offsetAmount = { left: 0, top: 0 };
	}

	// 返回右边线条位置
	public get rightStyle(): number {
		return this.left + this.width;
	}

	// 返回底部线条位置
	public get bottomStyle(): number {
		return this.top + this.height;
	}

	// 返回中线位置
	public get vCenterStyle(): number {
		return this.left + this.width / 2;
	}

	// 返回横中线位置
	public get hCenterStyle(): number {
		return this.top + this.height / 2;
	}
}
