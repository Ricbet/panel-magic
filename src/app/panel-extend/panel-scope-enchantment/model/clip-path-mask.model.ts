import { BehaviorSubject } from "rxjs";
import { ProfileModel } from "./profile.model";
// clip-path的方式
export type TClipPathType = "inset" | "circle" | "ellipse" | "polygon" | "";
// clip-path拖拽笔触的类型
export type TClipPointType =
	| "inset-c"
	| "inset-l"
	| "inset-t"
	| "inset-r"
	| "inset-b"
	| "circle-c"
	| "circle-side"
	| "ellipse-c"
	| "ellipse-r"
	| "ellipse-b"
	| "polygon"
	| "";
/**
 * 多边形的类型
 * 分别对应三角形、梯形、平行四边形、菱形、五边形和六边形
 */
export type TPolygonType = "triangle" | "trapezoidal" | "parallelogram" | "diamond" | "pentagon" | "hexagon" | "";

/**
 * 剪贴蒙版数据模型
 */
export class ClipPathMaskModel {
	// 当前选中的剪贴蒙版方式
	public currentPathType$: BehaviorSubject<TClipPathType> = new BehaviorSubject<TClipPathType>("");

	constructor() {}
}

/**
 * 拖拽点
 * inset、circle、ellipse和polygon的拖拽点的拖拽方式不尽相同，god
 */
export class ClipPointModel {
	// 拖拽方式类型，可移动还是可拉伸
	public type: TClipPointType = "";
	public left: number = 0;
	public top: number = 0;
	constructor(arg: { type: TClipPointType; left: number; top: number }) {
		this.type = arg.type;
		this.left = arg.left;
		this.top = arg.top;
	}
	public get styleContent(): { [key: string]: string } {
		return { left: `${this.left}%`, top: `${this.top}%` };
	}
}

/**
 * 正方形inset的蒙版数据模型
 */
export class ClipInsetModel {
	// 拖拽点
	public pointList$: BehaviorSubject<Array<ClipPointModel>> = new BehaviorSubject([]);
	public insetL: ClipPointModel = new ClipPointModel({ type: "inset-l", left: 10, top: 50 });
	public insetR: ClipPointModel = new ClipPointModel({ type: "inset-r", left: 90, top: 50 });
	public insetT: ClipPointModel = new ClipPointModel({ type: "inset-t", left: 50, top: 10 });
	public insetB: ClipPointModel = new ClipPointModel({ type: "inset-b", left: 50, top: 90 });
	public insetC: ClipPointModel = new ClipPointModel({ type: "inset-c", left: 50, top: 50 });
	constructor() {}
	public createPath(): void {
		this.pointList$.next([this.insetL, this.insetR, this.insetT, this.insetB, this.insetC]);
	}
	public get styleContent(): { [key: string]: string } {
		return {
			"clip-path": `inset(${this.insetT.top}% ${100 - this.insetR.left}% ${100 - this.insetB.top}% ${
				this.insetL.left
			}%)`
		};
	}
}

/**
 * 圆形circle的蒙版数据模型
 */
export class ClipCircleModel {
	// 拖拽点
	public pointList$: BehaviorSubject<Array<ClipPointModel>> = new BehaviorSubject([]);
	public circleSide: ClipPointModel = new ClipPointModel({ type: "circle-side", left: 0, top: 0 });
	public circleC: ClipPointModel = new ClipPointModel({ type: "circle-c", left: 49.9, top: 50.1 });
	// 圆的半径
	public circleRadius: number = 45;
	constructor() {}
	// 计算圆点于轮廓的中心点之间的斜率k值
	public calcSlopeK(pro: ProfileModel): number {
		const _ =
			(pro.height - (this.circleC.top / 100) * pro.height - pro.height / 2) /
			((this.circleC.left / 100) * pro.width - pro.width / 2);
		return isNaN(_) ? 1 : _;
	}
	// 计算斜率公式的b
	public calcSlopeB(pro: ProfileModel): number {
		return (
			pro.height -
			(this.circleC.top / 100) * pro.height -
			this.calcSlopeK(pro) * ((this.circleC.left / 100) * pro.width)
		);
	}
	// 根据side圆周上的坐标计算半径
	public handleSideToRadius(pro: ProfileModel): void {
		const _x = this.circleSide.left - (this.circleC.left / 100) * pro.width;
		const _y = this.circleSide.top - (this.circleC.top / 100) * pro.height;
		this.circleRadius = (Math.sqrt(_x ** 2 + _y ** 2) * 2 * 100) / (pro.width + pro.height);
	}
	// 计算圆周上的拖拽点的位置
	public handleCalcCircleSidePoint(pro: ProfileModel): void {
		// 百分比转化为常值
		let _calc_per = (n: number, type: "width" | "height" = "width"): number => {
			return (n / 100) * pro[type];
		};
		// 计算半径
		let _calc_radius = (pro.width * (this.circleRadius / 100) + pro.height * (this.circleRadius / 100)) / 2;
		// 计算圆中心点离轮廓中心点的距离
		let _calc_center_dist = () => {
			let _ = Math.sqrt(
				(_calc_per(this.circleC.left) - pro.width / 2) ** 2 +
					(_calc_per(this.circleC.top, "height") - pro.height / 2) ** 2
			);
			return _ == 0 ? 1 : _;
		};
		/**
		 * 进而得出公式
		 * y=kx+b
		 * x=(y-b)/k
		 */
		this.circleSide.left =
			((_calc_center_dist() - _calc_radius) / _calc_center_dist()) *
				(_calc_per(this.circleC.left) - pro.width / 2) +
			pro.width / 2;
		this.circleSide.top = pro.height - this.calcSlopeK(pro) * this.circleSide.left - this.calcSlopeB(pro);
	}
	public createPath(): void {
		const _arr = [this.circleSide, this.circleC];
		this.pointList$.next(_arr);
	}
	public get styleContent(): { [key: string]: string } {
		return { "clip-path": `circle(${this.circleRadius}% at ${this.circleC.left}% ${this.circleC.top}%)` };
	}
}

/**
 * 椭圆ellipse的蒙版数据模型
 */
export class ClipEllipseModel {
	// 拖拽点
	public pointList$: BehaviorSubject<Array<ClipPointModel>> = new BehaviorSubject([]);
	public ellR: ClipPointModel = new ClipPointModel({ type: "ellipse-r", left: 80, top: 50 });
	public ellB: ClipPointModel = new ClipPointModel({ type: "ellipse-b", left: 50, top: 95 });
	public ellC: ClipPointModel = new ClipPointModel({ type: "ellipse-c", left: 50, top: 50 });
	constructor() {}
	public createPath(): void {
		const _arr = [this.ellR, this.ellB, this.ellC];
		this.pointList$.next(_arr);
	}
	public get styleContent(): { [key: string]: string } {
		return {
			"clip-path": `ellipse(${Math.abs(this.ellR.left - this.ellC.left)}% ${Math.abs(
				this.ellB.top - this.ellC.top
			)}% at ${this.ellC.left}% ${this.ellC.top}%)`
		};
	}
}

/**
 * 多边形polygon的蒙版数据模型
 * 'triangle' | 'trapezoidal' | 'parallelogram' | 'diamond' | 'pentagon' | 'hexagon'
 *
 */
export class ClipPolygonModel {
	// 拖拽点
	public pointList$: BehaviorSubject<Array<ClipPointModel>> = new BehaviorSubject([]);
	// 赋给样式的值字符串
	public styleStr: string = "";
	// 拖拽点的订阅值
	public get pointArr(): Array<ClipPointModel> {
		return this.pointList$.value;
	}

	constructor() {}

	public get styleContent(): { [key: string]: string } {
		if (this.pointArr.length == 3) {
			this.styleStr = `${this.pointArr[0].left}% ${this.pointArr[0].top}%, ${this.pointArr[1].left}% ${
				this.pointArr[1].top
			}%, ${this.pointArr[2].left}% ${this.pointArr[2].top}%`;
		} else if (this.pointArr.length == 4) {
			this.styleStr = `${this.pointArr[0].left}% ${this.pointArr[0].top}%, ${this.pointArr[1].left}% ${
				this.pointArr[1].top
			}%, ${this.pointArr[2].left}% ${this.pointArr[2].top}%, ${this.pointArr[3].left}% ${this.pointArr[3].top}%`;
		} else if (this.pointArr.length == 5) {
			this.styleStr = `${this.pointArr[0].left}% ${this.pointArr[0].top}%, ${this.pointArr[1].left}% ${
				this.pointArr[1].top
			}%, ${this.pointArr[2].left}% ${this.pointArr[2].top}%, ${this.pointArr[3].left}% ${
				this.pointArr[3].top
			}%, ${this.pointArr[4].left}% ${this.pointArr[4].top}%`;
		} else if (this.pointArr.length == 6) {
			this.styleStr = `${this.pointArr[0].left}% ${this.pointArr[0].top}%, ${this.pointArr[1].left}% ${
				this.pointArr[1].top
			}%, ${this.pointArr[2].left}% ${this.pointArr[2].top}%, ${this.pointArr[3].left}% ${
				this.pointArr[3].top
			}%, ${this.pointArr[4].left}% ${this.pointArr[4].top}%, ${this.pointArr[5].left}% ${this.pointArr[5].top}%`;
		}
		return { "clip-path": `polygon(${this.styleStr})` };
	}

	public createPath(type: TPolygonType): void {
		let _arr = [];
		switch (type) {
			case "triangle":
				_arr = [
					new ClipPointModel({ type: "polygon", left: 50, top: 0 }),
					new ClipPointModel({ type: "polygon", left: 0, top: 100 }),
					new ClipPointModel({ type: "polygon", left: 100, top: 100 })
				];
				break;
			case "trapezoidal":
				_arr = [
					new ClipPointModel({ type: "polygon", left: 20, top: 0 }),
					new ClipPointModel({ type: "polygon", left: 80, top: 0 }),
					new ClipPointModel({ type: "polygon", left: 100, top: 100 }),
					new ClipPointModel({ type: "polygon", left: 0, top: 100 })
				];
				break;
			case "parallelogram":
				_arr = [
					new ClipPointModel({ type: "polygon", left: 25, top: 0 }),
					new ClipPointModel({ type: "polygon", left: 100, top: 0 }),
					new ClipPointModel({ type: "polygon", left: 75, top: 100 }),
					new ClipPointModel({ type: "polygon", left: 0, top: 100 })
				];
				break;
			case "diamond":
				_arr = [
					new ClipPointModel({ type: "polygon", left: 50, top: 0 }),
					new ClipPointModel({ type: "polygon", left: 100, top: 50 }),
					new ClipPointModel({ type: "polygon", left: 50, top: 100 }),
					new ClipPointModel({ type: "polygon", left: 0, top: 50 })
				];
				break;
			case "pentagon":
				_arr = [
					new ClipPointModel({ type: "polygon", left: 50, top: 0 }),
					new ClipPointModel({ type: "polygon", left: 100, top: 38 }),
					new ClipPointModel({ type: "polygon", left: 82, top: 100 }),
					new ClipPointModel({ type: "polygon", left: 18, top: 100 }),
					new ClipPointModel({ type: "polygon", left: 0, top: 38 })
				];
				break;
			case "hexagon":
				_arr = [
					new ClipPointModel({ type: "polygon", left: 50, top: 0 }),
					new ClipPointModel({ type: "polygon", left: 100, top: 25 }),
					new ClipPointModel({ type: "polygon", left: 100, top: 75 }),
					new ClipPointModel({ type: "polygon", left: 50, top: 100 }),
					new ClipPointModel({ type: "polygon", left: 0, top: 75 }),
					new ClipPointModel({ type: "polygon", left: 0, top: 25 })
				];
				break;
			default:
				break;
		}
		this.pointList$.next(_arr);
	}
}
