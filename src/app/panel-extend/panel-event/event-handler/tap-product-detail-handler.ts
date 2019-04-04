import { EventModel } from "./event.model";

/**
 * 产品详情数据详情
 */
export class TapProductDetailHandler extends EventModel {
	private _productId: string;
	private _productName: string;

	public get productId(): string {
		return this._productId;
	}
	public set productId(v: string) {
		this._productId = v;
		this.setData({ eventParams: { id: this.productId, name: this.productName } });
	}

	public get productName(): string {
		return this._productName;
	}
	public set productName(v: string) {
		this._productName = v;
		this.setData({ eventParams: { id: this.productId, name: this.productName } });
	}

	constructor() {
		super();
		this.setData({ eventHandler: "tapProductDetailHandler" });
	}
}
