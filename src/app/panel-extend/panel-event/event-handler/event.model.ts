import { Subject } from "rxjs";

// 事件基类
export class EventModel {
	public readonly valueChange$: Subject<EventModel> = new Subject();

	// 事件处理程序
	public eventHandler: string = "";
	// 事件处理参数
	public eventParams: { [key: string]: string } = null;

	constructor() {}

	public get autoWidgetEvent(): {
		eventHandler: string;
		eventParams: { [key: string]: string };
	} {
		return { eventHandler: this.eventHandler, eventParams: this.eventParams };
	}

	public setData(data: { eventHandler?: string; eventParams?: { [key: string]: string } }): void {
		if (!data) return;
		if ((<Object>data).hasOwnProperty("eventHandler")) this.eventHandler = data.eventHandler;
		if ((<Object>data).hasOwnProperty("eventParams")) this.eventParams = data.eventParams;
	}

	public reset(): void {
		this.eventHandler = "";
		this.eventParams = null;
	}
}
