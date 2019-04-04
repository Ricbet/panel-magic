import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { PanelWidgetModel } from "../panel-widget/model";
import { VesselWidgetModel, VesselStatusCollectionModel } from "./model";

@Injectable({
	providedIn: "root"
})
export class PanelSeniorVesselEditService {
	/**
	 * 该变量是检测一切原本从面板创建的新组件和widgetList拦截过来，使得之前所有增添或删减widgetList数据的指引对象都转移到该变量数据中
	 * 导流widget列表
	 */
	public riverDiversionWidgetList$: BehaviorSubject<PanelWidgetModel[]> = new BehaviorSubject([]);

	// 当前正在编辑的动态容器组件
	public currentEditVesselWidget$: BehaviorSubject<PanelWidgetModel> = new BehaviorSubject(null);

	// 是否进入了编辑动态容器模式
	public isEnterEditVesselCondition$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	// 动态容器内的所有状态及其对应的widget组件集合数据模型
	public vesselWidgetModel$: BehaviorSubject<VesselWidgetModel> = new BehaviorSubject(new VesselWidgetModel());

	// 发射当前动态容器的状态变化的可观察对象
	public launchCurrentStatusIdChange$: Subject<string> = new Subject<string>();

	constructor() {}

	/**
	 * 进入动态容器修改模式（Room），并开启遮罩隐藏
	 * 需传递动态容器组件
	 */
	public openEditVesselRoom(widget: PanelWidgetModel): void {
		if (widget && widget.type === "seniorvessel") {
			this.currentEditVesselWidget$.next(widget);
			this.isEnterEditVesselCondition$.next(true);
		}
	}

	/**
	 * 关闭动态容器修改模式，并隐藏遮罩
	 */
	public closeEditVesselRoom(): void {
		this.currentEditVesselWidget$.next(null);
		this.isEnterEditVesselCondition$.next(false);
	}

	/**
	 * 获取当前容器状态的详细数据（状态名称、状态id、状态下的对应widgetlist等）
	 */
	public get currentStatusInVesselInfo(): VesselStatusCollectionModel {
		const _vessel = this.vesselWidgetModel$.value;
		return _vessel.repertoryStatusWarehouse[_vessel.currentStatusId];
	}

	/**
	 * 返回当前动态容器的宽高
	 */
	public sendVesselHeightWidget(): {
		height: string;
		width: string;
	} {
		const _vessel = this.currentEditVesselWidget$.value;
		return {
			height: _vessel ? _vessel.profileModel.styleContent.height : "10px",
			width: _vessel ? _vessel.profileModel.styleContent.width : "10px"
		};
	}
}
