import { OrientationModel } from "./orientation.model";

interface StyleLabel {
	data: any;
	children: any[];
}

// style数据模型
export class StyleModel implements StyleLabel {
	data: any = {}; // 存放内联样式
	children: Array<StyleModel> = []; // 如果有子标签，则存放子标签的样式和对应的StyleModel
	constructor() {}
}

export interface ICustomfeature {
	eventHandler?: string;
	eventParams?: any;
	[key: string]: any;
}

/**
 * 容器当中所有存放的组件数据列表，其中包括该组件的名称，样式，名称等基本信息
 */
export class WidgetModel {
	public type: string;
	public content: any;
	public style: StyleModel;
	public customfeature: ICustomfeature;
	public orientationmodel: OrientationModel;

	constructor(param?: WidgetModel) {
		this.initData();
		this.setData(param);
	}

	/**
	 * 初始化数据
	 */
	public initData(): void {
		this.customfeature = {};
		this.style = new StyleModel();
		this.content = "";
		this.type = "";
		this.orientationmodel = new OrientationModel();
	}

	public setData(obj: WidgetModel): void {
		if (obj) {
			this.customfeature = obj.customfeature;
			this.style = obj.style;
			this.content = obj.content;
			this.type = obj.type;
			if (obj.orientationmodel) {
				this.orientationmodel = new OrientationModel(obj.orientationmodel);
			} else {
				this.orientationmodel = new OrientationModel();
			}
		}
	}
}
