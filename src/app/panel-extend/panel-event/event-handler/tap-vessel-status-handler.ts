import { EventModel } from "./event.model";

/**
 * 动态容器的状态数据模型
 */
export class TapVesselStatusHandler extends EventModel {
	private _toStatusId: string;
	public get toStatusId(): string {
		return this._toStatusId;
	}
	public set toStatusId(v: string) {
		this._toStatusId = v == "" ? null : v;
		this.setData({ eventParams: { to_status_id: this.toStatusId } });
	}

	constructor(statusId: string = "") {
		super();
		this.toStatusId = statusId;
		this.setData({ eventHandler: "tapVesselStatusHandler" });
	}
}
