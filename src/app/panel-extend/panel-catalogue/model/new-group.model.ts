export class NewGroupModel {
	// 是否弹出分组页面
	private _visible: boolean;
	// 分组名称
	private _name: string;

	public get name(): string {
		return this._name;
	}
	public set name(v: string) {
		this._name = v;
	}

	public get visible(): boolean {
		return this._visible;
	}
	public set visible(v: boolean) {
		this._visible = v;
	}

	constructor() {
		this.initData();
	}

	public initData(): void {
		this.visible = false;
		this.name = "";
	}
}
