import { EventModel } from "./event.model";

// 跳转页面
export class TapNavigateHandler extends EventModel {
	private _navUrl: string;
	public get navUrl(): string {
		return this._navUrl;
	}
	public set navUrl(v: string) {
		this._navUrl = v == "" ? null : v;
		this.setData({ eventParams: { nav_url: this.navUrl } });
	}

	constructor(router: string = "") {
		super();
		this.navUrl = router;
		this.setData({ eventHandler: "tapNavigateHandler" });
	}
}
