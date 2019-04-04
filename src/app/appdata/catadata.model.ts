import { PagesModel } from "./pages.model";
import { uniqueId } from "../public/util";
import { isObject } from "lodash";

interface ICataDataable {
	group: string;
	pages?: Array<PagesModel>;
}

export class CataDataModel implements ICataDataable {
	// 分组名称
	public group: string;
	// 分组页面
	public pages: Array<PagesModel>;
	// 是否处于编辑状态,默认都是为false
	public isEdit: boolean;
	// 根据时间戳唯一标示符
	public uniqueId: number;

	constructor(data?: ICataDataable) {
		this.initData();
		if (isObject(data)) this.setData(data);
	}

	public initData(): void {
		this.group = "";
		this.pages = [];
		this.isEdit = false;
		setTimeout(() => {
			this.uniqueId = +uniqueId(false);
		}, 10);
	}

	public setData(data: ICataDataable): void {
		if ((<Object>data).hasOwnProperty("group")) this.group = data.group;
		if ((<Object>data).hasOwnProperty("pages") && Array.isArray(data.pages)) {
			this.pages.length = 0;
			data.pages.forEach(_e => this.pages.push(new PagesModel(_e)));
		}
	}

	// 创建新页面,默认name和title是同一个名称,同时添加新的router
	// 参数index表示，如果不传则在后面添加新数据，否则在指定位置插入新数据
	public newPage(router: string, name: string, index: number = -1): void {
		const awaitPages = new PagesModel({
			title: name,
			name: name,
			router: router
		});

		if (index == -1) {
			this.pages.push(awaitPages);
		} else if (index > 0) {
			this.pages.splice(index, 0, awaitPages);
		}
	}

	public delPage(index: number): void {
		this.pages.splice(index, 1);
	}
}
