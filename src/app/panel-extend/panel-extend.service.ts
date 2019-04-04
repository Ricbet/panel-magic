import { Injectable, ElementRef } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { TransformMatrixModel, TrackModel, SelectionRectModel, PanelInfoModel } from "./model";
import { PanelWidgetModel } from "./panel-widget/model";
import { cloneDeep, get } from "lodash";
import { CombinationWidgetModel } from "./panel-scope-enchantment/model";
import { AppDataService } from "../appdata/appdata.service";
import { uniqueId } from "@ng-public/util";
import { PanelSeniorVesselEditService } from "./panel-senior-vessel-edit/panel-senior-vessel-edit.service";
import { VesselWidgetModel } from "./panel-senior-vessel-edit/model";
import { WidgetModel } from "./panel-widget/model/widget.model";
import { HostItemModel } from "./panel-widget/model/host.model";
import { OrientationModel } from "./panel-widget/model/orientation.model";

@Injectable({
	providedIn: "root"
})
export class PanelExtendService {
	// 执行保存到本地数据库DB操作
	public launchSaveIndexedDB$: Subject<never> = new Subject<never>();
	// 执行记录面板panel的视图位置信息
	public launchRecordPanelInfoRect$: Subject<never> = new Subject<never>();

	// 面板区域的宿主元素
	public panelMainEl: ElementRef;

	// 主视图的transform的变换数据模型
	public transformMatrixModel: TransformMatrixModel = new TransformMatrixModel();
	// 中央画板主屏幕的页面信息数据膜 ( 若处于动态容器编辑模式下，则改变其对象数据指引 )
	public panelInfoModel: PanelInfoModel = new PanelInfoModel();
	// 滚动条数据模型
	public trackModel: TrackModel = new TrackModel();
	// 可选区域的矩形数据模型
	public selectionRectModel: SelectionRectModel = new SelectionRectModel();

	// 当前自由面板内的组件列表内容
	public widgetList$: BehaviorSubject<Array<PanelWidgetModel>> = new BehaviorSubject<Array<PanelWidgetModel>>([]);

	// 是否允许鼠标拖拽视图
	public isOpenSpacebarMove$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(
		private readonly appDataService: AppDataService,
		private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService
	) {}

	/**
	 * 获取zIndex层级的最小值和最大值
	 */
	public findZIndexExtremum(): { min: number; max: number } {
		const widgetList = this.valueWidgetList();
		let min = Infinity;
		let max = -Infinity;
		widgetList.forEach(_w => {
			min = Math.min(min, _w.profileModel.zIndex);
			max = Math.max(max, _w.profileModel.zIndex);
		});
		return { min: min, max: max };
	}

	/**
	 * 转化HostItemModel为PanelWidgetModel
	 * 对组合组件特殊转化
	 * 对动态容器组件特殊转化
	 */
	public handleFreeItemToPanelWidget(arr: Array<WidgetModel>): PanelWidgetModel[] {
		if (Array.isArray(arr)) {
			const res = [];
			arr.forEach(_e => {
				const copyE = cloneDeep(_e);
				const widgetE = new PanelWidgetModel(<HostItemModel>{ autoWidget: copyE, type: copyE.type });
				if (widgetE.type == "combination" && Array.isArray(widgetE.autoWidget.content)) {
					const content = [];
					widgetE.autoWidget.content.forEach((w: WidgetModel) => {
						const copyW = cloneDeep(w);
						const widgetW = new PanelWidgetModel(<HostItemModel>{
							autoWidget: copyW,
							type: copyW.type
						});
						const combinationData = new CombinationWidgetModel(widgetE);
						combinationData.setData({
							left: w.orientationmodel.left,
							top: w.orientationmodel.top,
							width: w.orientationmodel.width,
							height: w.orientationmodel.height,
							rotate: w.orientationmodel.rotate
						});
						widgetW.profileModel.setData({
							left: combinationData.left + widgetE.profileModel.left,
							top: combinationData.top + widgetE.profileModel.top
						});
						widgetW.profileModel.combinationWidgetData$.next(combinationData);
						// // 计算子集组件在组合组件里的位置比例
						widgetW.profileModel.combinationWidgetData$.value.recordInsetProOuterSphereFourProportion();
						widgetW.profileModel.recordImmobilizationData();
						content.push(widgetW);
					});
					widgetE.autoWidget.content = content;
				} else if (widgetE.type == "seniorvessel" && get(widgetE, "autoWidget.content.vesselWidget")) {
					widgetE.autoWidget.content.vesselWidget = new VesselWidgetModel(
						get(widgetE, "autoWidget.content.vesselWidget")
					);
				}
				res.push(widgetE);
			});
			return res;
		} else {
			return [];
		}
	}

	/**
	 * 执行保存操作的时候需要处理widget的orientationModel数据，以便映射在appDataModel每一个页面中的else数组
	 */
	public handleSaveWidgetToOrientationModelData(
		widgetList: Array<PanelWidgetModel> = this.widgetList$.value
	): Array<WidgetModel> {
		const saveFreeItem = [];
		if (Array.isArray(widgetList)) {
			widgetList.forEach(w => {
				w = cloneDeep(w);
				if (w.type == "combination" && Array.isArray(w.autoWidget.content)) {
					w.autoWidget.content = this.handleCombinationChildWidgetList(w);
				} else if (w.type == "seniorvessel") {
					w.autoWidget.orientationmodel.left = w.profileModel.left;
					w.autoWidget.orientationmodel.top = w.profileModel.top;
					w.autoWidget.orientationmodel.width = w.profileModel.width;
					w.autoWidget.orientationmodel.height = w.profileModel.height;
					w.autoWidget.orientationmodel.rotate = w.profileModel.rotate;
					w.autoWidget.orientationmodel.zIndex = w.profileModel.zIndex;
					w.autoWidget.customfeature = w.panelEventHandlerModel.autoWidgetEvent;
					w.autoWidget.style.data = w.ultimatelyStyle;
				}
				saveFreeItem.push(w.autoWidget);
			});
		}
		return saveFreeItem;
	}

	/**
	 * 转化组合组件里的子集组件，使其在简易版自由面板能够正确处理数据
	 */
	public handleCombinationChildWidgetList(widget: PanelWidgetModel): Array<HostItemModel> {
		const childWidth = widget.autoWidget.content;
		const saveFreeItem = [];
		childWidth.forEach((w: PanelWidgetModel) => {
			w = cloneDeep(w);
			if (
				(<Object>w).hasOwnProperty("autoWidget") &&
				w.autoWidget.orientationmodel &&
				w.profileModel.combinationWidgetData$
			) {
				const comW = w.profileModel.combinationWidgetData$.value;
				w.autoWidget.orientationmodel.setData(<OrientationModel>{
					left: comW.left,
					top: comW.top,
					width: comW.width,
					height: comW.height,
					rotate: comW.rotate
				});
				w.autoWidget.style.data = w.ultimatelyStyle;
			}
			saveFreeItem.push(w.autoWidget);
		});
		return saveFreeItem;
	}

	/**
	 * 清除无效事件
	 */
	public clearInvalidEvent(): void {
		const pageObj = this.appDataService.appDataModel.app_data;
		if (pageObj) {
			for (const e in pageObj) {
				if (Array.isArray(pageObj[e].eles)) {
					pageObj[e].eles.forEach(widget => {
						if (widget.customfeature && widget.customfeature.eventHandler == "tapNavigateHandler") {
							const _nav_url = widget.customfeature.eventParams.nav_url;
							if (!Object.keys(pageObj).includes(_nav_url)) {
								widget.customfeature.eventHandler = "";
								widget.customfeature.eventParams = null;
							}
						}
					});
				}
			}
		}
	}

	/**
	 * 置于顶层或底层
	 * widgets是被选组件widget
	 */
	public handleZIndexTopOrBottom(widgets: Array<PanelWidgetModel>, type: "top" | "bottom"): void {
		if (Array.isArray(widgets)) {
			const { min, max } = this.findZIndexExtremum();
			const uniqueidList = widgets.map(e => e.uniqueId);
			if (type == "top") {
				// 先按照zindex顺序从小排大
				widgets = widgets.sort((a, b) => a.profileModel.zIndex - b.profileModel.zIndex);
				widgets.forEach((w, i) => {
					w.profileModel.setData({
						zIndex: max + i + 1
					});
				});
				this.deletePanelWidget(uniqueidList);
				this.nextWidgetList(this.valueWidgetList().concat(widgets));
			} else if (type == "bottom") {
				// 先按照zindex顺序从大排小
				widgets = widgets.sort((a, b) => b.profileModel.zIndex - a.profileModel.zIndex);
				widgets.forEach((w, i) => {
					w.profileModel.setData({
						zIndex: min - i - 1
					});
				});
				this.deletePanelWidget(uniqueidList);
				widgets = widgets.reverse();
				this.nextWidgetList([...widgets, ...this.valueWidgetList()]);
			}
		}
	}

	/**
	 * 根据唯一uniqueId删除widget组件
	 */
	public deletePanelWidget(nrId: string | Array<string | number>): void {
		const nrid = Array.isArray(nrId) ? nrId : [nrId];
		const repetWid = this.valueWidgetList().filter(e => !nrid.includes(e.uniqueId));
		this.nextWidgetList(repetWid);
		this.launchSaveIndexedDB$.next();
	}

	/**
	 * 添加新的widget组件
	 * 重新设置zindex的值
	 * 每次添加组件之前都记录数据并保存到indexedDB
	 */
	public addPanelWidget(newWidget: Array<PanelWidgetModel>): void {
		if (Array.isArray(newWidget)) {
			let arr = this.valueWidgetList();
			const { max } = this.findZIndexExtremum();
			newWidget.forEach((w, _i) => {
				setTimeout(() => (w.uniqueId = `${uniqueId()}${Math.round(Math.random() * 10000)}`));
				w.profileModel.setData({
					zIndex: max == -Infinity ? 1 : max + _i + 1
				});
				w.autoWidget.orientationmodel.left = w.profileModel.left;
				w.autoWidget.orientationmodel.top = w.profileModel.top;
				w.autoWidget.orientationmodel.width = w.profileModel.width;
				w.autoWidget.orientationmodel.height = w.profileModel.height;
				w.autoWidget.orientationmodel.rotate = w.profileModel.rotate;
				w.autoWidget.orientationmodel.zIndex = w.profileModel.zIndex;
			});
            arr = arr.concat(newWidget);
			this.nextWidgetList(arr);
			setTimeout(() => {
				this.launchSaveIndexedDB$.next();
			}, 11);
		}
	}

	/**
	 * next -> widgetlist数据的统一入口，用于作拦截处理
	 */
	public nextWidgetList(params: PanelWidgetModel[]): void {
		if (this.panelSeniorVesselEditService.isEnterEditVesselCondition$.value) {
			this.panelSeniorVesselEditService.riverDiversionWidgetList$.next(params);
		} else {
			this.widgetList$.next(params);
		}
	}

	/**
	 * 获取widgetList$的value值
	 */
	public valueWidgetList(): PanelWidgetModel[] {
		const isVesselMode = this.panelSeniorVesselEditService.isEnterEditVesselCondition$.value;
		return isVesselMode
			? this.panelSeniorVesselEditService.riverDiversionWidgetList$.value
			: this.widgetList$.value;
	}
}
