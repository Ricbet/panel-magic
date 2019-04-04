import { EventModel } from "./event.model";

// 拨打电话
export class TapCallHandler extends EventModel {
	private _phoneNum: string;
	public get phoneNum(): string {
		return this._phoneNum;
	}
	public set phoneNum(v: string) {
		this._phoneNum = v;
		this.setData({ eventParams: { phone_num: this.phoneNum } });
	}

	constructor() {
		super();
		this.setData({
			eventHandler: "tapCallHandler",
			eventParams: {
				phone_num: this.phoneNum
			}
		});
	}

	public setPhoneNum(num: string): void {
		this.phoneNum = num;
		this.setData({ eventParams: { phone_num: this.phoneNum } });
	}
}
