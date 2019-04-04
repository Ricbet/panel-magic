import { uniqueId } from "../public/util";
import { isObject } from "lodash";

interface IPagesable {
	title: string;
	name: string;
	router: string;
}

export class PagesModel implements IPagesable {
	// 页面对应的路径
	public router: string;
	// 页面的名称
	public name: string;
	// 页面的标题
	public title: string;
	// 是否处于编辑状态
	public isEdit: boolean;
	// 根据时间戳的唯一标识符
	public uniqueId: number;

	constructor(data?: IPagesable) {
		this.initData();
		if (isObject(data)) this.setData(data);
	}

	public initData(): void {
		this.title = "";
		this.name = "";
		this.router = "";
		this.isEdit = false;
		setTimeout(() => {
			this.uniqueId = +uniqueId(false);
		}, 10);
	}

	public setData(data: IPagesable): void {
		if ((<Object>data).hasOwnProperty("title")) this.title = data.title;
		if ((<Object>data).hasOwnProperty("name")) this.name = data.name;
		if ((<Object>data).hasOwnProperty("router")) this.router = data.router;
	}
}
