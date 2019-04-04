import { BehaviorSubject } from "rxjs";
import { TEventHandler } from "../event-handler";

// 链接事件设置的数据模型
export class EventSiteModel {
	public left: number = 0;
	public top: number = 0;

	public isVisibleModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	// 当前事件的可观察对象类型
	public currentEventModel$: BehaviorSubject<TEventHandler> = new BehaviorSubject(null);

	constructor() {}

	public get styleContent(): { [key: string]: string } {
		return {
			left: this.left + "px",
			top: this.top + "px"
		};
	}

	public setPosition(data: { left: number; top: number }): void {
		if (data) {
			this.left = data.left;
			this.top = data.top;
		}
	}
}
