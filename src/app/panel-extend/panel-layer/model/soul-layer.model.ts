import { BehaviorSubject } from "rxjs";
import { LayerModel } from "./layer.model";

// 组件库和图层的数据模型
export class SoulLayerModel {
	// 图层
	public layerWidgetList$: BehaviorSubject<Array<LayerModel>> = new BehaviorSubject([]);

	constructor() {}

	/**
	 * 移除所有图层的选中状态
	 */
	public resetAllLayerActive(): void {
		this.layerWidgetList$.value.map(_e => (_e.isActive = false));
		this.layerWidgetList$.next(this.layerWidgetList$.value);
	}
}
