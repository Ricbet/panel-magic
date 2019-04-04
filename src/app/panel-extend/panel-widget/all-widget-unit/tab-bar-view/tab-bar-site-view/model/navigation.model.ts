/**
 *	记录每一个导航的详细数据
 */
export class NavigationModel {
	// 导航的标题
	public title: string;
	// 初始的图片
	public initImg: string;
	// 选中的图片
	public selectImg: string;
	// 链接
	public link: string;
	// 是否被选中
	public active: boolean;
	// 点击事件的头
	public eventHandler: string;
	// 点击事件的链接
	public eventParams: any;

	constructor(obj: any = {}) {
		this.initData();
		this.setData(obj);
	}

	public setData(obj: any): void {
		if (obj && Object.keys(obj).length > 0) {
			if (obj["title"]) this.title = obj["title"];
			if (obj["initImg"]) this.initImg = obj["initImg"];
			if (obj["selectImg"]) this.selectImg = obj["selectImg"];
			if (obj["link"]) this.link = obj["link"];
			if (obj["active"]) this.active = obj["active"];
			if (obj["eventHandler"]) this.eventHandler = obj["eventHandler"];
			if (obj["eventParams"]) this.eventParams = obj["eventParams"];
		}
	}

	public initData(): void {
		this.title = "标题";
		this.initImg = "";
		this.selectImg = "";
		this.link = "";
		this.active = false;
		this.eventHandler = "";
		this.eventParams = null;
	}
}
