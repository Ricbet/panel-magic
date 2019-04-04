import { uniqueId } from "@ng-public/util";
import { WidgetModel } from "app/panel-extend/panel-widget/model/widget.model";

interface IVesselStatusCollectionable {
	name: string;
	uniqueId: string;
	widgetList: WidgetModel[];
	isEdit: boolean;
}

/**
 * 动态容器的状态集合数据模型
 * 表示每一个状态下的widgetlist集合以及对应状态的名称、可用于拓展
 */
export class VesselStatusCollectionModel implements IVesselStatusCollectionable {
	// 状态名称
	public name: string = "";
	// 状态的唯一标示
	public uniqueId: string = "";
	// 该状态下的widget集合
	public widgetList: WidgetModel[] = [];
	// 是否处于编辑状态
	public isEdit: boolean = false;

	constructor(data?: IVesselStatusCollectionable) {
		if (data) this.setData(data);
	}

	public setData(data: IVesselStatusCollectionable) {
		if ((<Object>data).hasOwnProperty("name")) this.name = data.name;
		if ((<Object>data).hasOwnProperty("uniqueId")) this.uniqueId = data.uniqueId;
		if ((<Object>data).hasOwnProperty("isEdit")) this.isEdit = !!data.isEdit;
		if ((<Object>data).hasOwnProperty("widgetList") && Array.isArray(data.widgetList)) {
			this.widgetList = data.widgetList.reduce<WidgetModel[]>((pre, cur) => {
				return [...pre, new WidgetModel(cur)];
			}, []);
		}
	}

	/**
	 * 初始化状态列表
	 */
	public initStatus(name: string): void {
		this.name = name;
		this.uniqueId = <string>uniqueId();
		this.widgetList = [];
		this.isEdit = false;
	}
}
