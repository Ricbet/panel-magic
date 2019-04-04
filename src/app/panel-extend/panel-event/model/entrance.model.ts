import { BehaviorSubject } from "rxjs";

// 入口连接的数据模型
// 是显示在任何一个组件的右侧方的点击图标，点击后才会显示事件设置
export class EntranceModel {
	public left: number = 0;
	public top: number = 0;

	public isShow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor() {}

	public get styleContent(): { [key: string]: string } {
		return {
			left: this.left + "px",
			top: this.top + "px"
		};
	}

	public setData(data: { left: number; top: number }): void {
		if (data) {
			this.left = data.left;
			this.top = data.top;
		}
	}
}
