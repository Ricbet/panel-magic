import { LineModel } from "./line.model";
import { BehaviorSubject } from "rxjs";

/**
 * 画布的标尺数据模型
 */
export class CanvasScaleplateModel {
	// 标尺宽度
	public width: number = 0;
	// 标尺高度
	public height: number = 0;

	// 临时移入需要显示的线段,并跟随鼠标移动
	public temporaryLine$: BehaviorSubject<LineModel> = new BehaviorSubject<LineModel>(null);

	// 固定的横向线段集合
	public hLineList$: BehaviorSubject<Array<LineModel>> = new BehaviorSubject<Array<LineModel>>([]);

	// 固定的纵向线段集合
	public vLineList$: BehaviorSubject<Array<LineModel>> = new BehaviorSubject<Array<LineModel>>([]);

	constructor() {}
}
