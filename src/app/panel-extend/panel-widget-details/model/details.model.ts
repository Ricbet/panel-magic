import { BehaviorSubject } from "rxjs";

/**
 * 组件设置
 */
export class DetailsModel {
	public left: number = 220;
	public top: number = 70;

	public zIndex: number = 103;

	public isShow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor() {}

	public get styleContent(): { [key: string]: string } {
		return {
			left: `${this.left}px`,
			top: `${this.top}px`,
			"z-index": `${this.zIndex}`
		};
	}
}
