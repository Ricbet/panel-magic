export class NewPageModel {
	// 是否显示弹出页面
	public visible: boolean;
	// 页面名称
	public name: string;
	// 所在分组的id
	public groupId: number;

	constructor() {
		this.initData();
	}

	public initData(): void {
		this.visible = false;
		this.name = "新页面";
		this.groupId = 0;
	}

	public setData(data: { name: string; groupId: number }): void {
		if ((<Object>data).hasOwnProperty("name")) this.name = data.name;
		if ((<Object>data).hasOwnProperty("groupId")) this.groupId = data.groupId;
	}
}
