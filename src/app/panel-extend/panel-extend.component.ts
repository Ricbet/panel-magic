import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, TemplateRef } from "@angular/core";
import { Subscription, BehaviorSubject, fromEvent } from "rxjs";
import { PanelExtendService } from "./panel-extend.service";
import { TransformMatrixModel, TrackModel, SelectionRectModel, PanelInfoModel, ScopeEnchantmentModel } from "./model";
import { IMouseDelta } from "@ng-public/directive/mousescroll/mousescroll.interface";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { PanelScopeEnchantmentService } from "./panel-scope-enchantment/panel-scope-enchantment.service";
import { PanelWidgetModel } from "./panel-widget/model";
import { NzDropdownMenuComponent, NzContextMenuService } from "ng-zorro-antd";
import { cloneDeep } from "lodash";
import { PanelSoulService } from "./panel-soul/panel-soul.service";
import { PanelExtendMoveBackService } from "./panel-extend-move-back.service";
import { AppDataService } from "../appdata/appdata.service";
import { PanelExtendQuickShortcutsService } from "./panel-extend-quick-shortcuts.service";
import { PanelSeniorVesselEditService } from "./panel-senior-vessel-edit/panel-senior-vessel-edit.service";

@Component({
	selector: "app-panel-extend",
	templateUrl: "./panel-extend.component.html",
	styleUrls: ["./panel-extend.component.scss", "./track.component.scss"]
})
export class PanelExtendComponent implements OnInit, OnDestroy {
	@ViewChild("panelContextMenuEl", { static: true }) public panelContextMenuEl: TemplateRef<any>;
	@ViewChild("freePanelMainEl", { static: true }) public set panelMainEl(v: ElementRef) {
		this.panelExtendService.panelMainEl = v;
	}
	// 主屏幕区域
	@ViewChild("panelEL", { static: true }) public panelEL: ElementRef;
	// 订阅widgetlist列表数据的改变和变化
	private widgetListChangeRX$: Subscription;
	// 订阅当前页面变化的可观察者
	private launchCurrentPageDataRX$: Subscription;
	// 订阅记录面板panel视图信息的可观察者
	private launchRecordPanelInfoRectRX$: Subscription;
	// 接收保存到本地数据库的可观察者
	private panelSaveIndexedDBRX$: Subscription;
	// 是否在按下了空格键之后再点击了鼠标
	public isSpacebarMousedown: boolean = false;
	// 鼠标按下的监听
	public listenMouseDownRX$: Subscription;
	// 鼠标移动的监听
	public listenMouseMoveRX$: Subscription;
	// 鼠标松开的监听
	public listenMouseUpRX$: Subscription;

	public get panelMainEl(): ElementRef {
		return this.panelExtendService.panelMainEl;
	}
	public get transform(): TransformMatrixModel {
		return this.panelExtendService.transformMatrixModel;
	}
	public get track(): TrackModel {
		return this.panelExtendService.trackModel;
	}
	public get widgetList$(): BehaviorSubject<Array<PanelWidgetModel>> {
		return this.panelExtendService.widgetList$;
	}
	public get isOpenSpacebarMove(): boolean {
		return this.panelExtendService.isOpenSpacebarMove$.value;
	}
	public get selectionRect(): SelectionRectModel {
		return this.panelExtendService.selectionRectModel;
	}
	public get panelInfo(): PanelInfoModel {
		return this.panelExtendService.panelInfoModel;
	}
	public get scopeEnchantmentModel(): ScopeEnchantmentModel {
		return this.panelScopeEnchantmentService.scopeEnchantmentModel;
	}

	// 是否进入某一个动态容器编辑模式
	public get isEnterEditVesselCondition(): boolean {
		return this.panelSeniorVesselEditService.isEnterEditVesselCondition$.value;
	}

	// 待创建的组件
	public get awaitWidgetVessel$(): BehaviorSubject<PanelWidgetModel> {
		return this.panelSoulService.awaitWidgetVessel$;
	}
	// 返回panel的样式
	public get panelStyleContent(): { [key: string]: string } {
		return {
			...this.transform.matrix,
			height: this.panelInfo.height + "px"
		};
	}
	// 返回当前的动态容器面板的高度和宽度
	public get currentVesselHeightWidgetStyleCOntent(): { [key: string]: string } {
		return {
			...this.transform.matrix,
			...this.panelSeniorVesselEditService.sendVesselHeightWidget()
		};
	}
	// 返回当前的动态容器
	public get currentVesselWidget(): PanelWidgetModel {
		return this.panelSeniorVesselEditService.currentEditVesselWidget$.value;
	}
	// 返回动态容器下的新增widgetlist组件列表（类widgetList）
	public get vesselWidgetList$(): BehaviorSubject<Array<PanelWidgetModel>> {
		return this.panelSeniorVesselEditService.riverDiversionWidgetList$;
	}

	constructor(
		private readonly panelExtendService: PanelExtendService,
		private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
		private readonly panelExtendMoveBackService: PanelExtendMoveBackService,
		private readonly panelExtendQuickShortcutsService: PanelExtendQuickShortcutsService,
		private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService,
		private readonly appDataService: AppDataService,
		private readonly panelSoulService: PanelSoulService,
		private readonly nzContextMenuService: NzContextMenuService,
		private readonly zone: NgZone
	) {
		// 一进来先清除所有indexeddb集合数据；
		this.panelExtendMoveBackService.indexedDB.deleteDatabase("panelDataDB");
		this.launchCurrentPageDataRX$ = this.appDataService.currentPageData$.subscribe(value => {
			if (value) {
				// 每次页面切换则创建DB集合
				this.panelExtendMoveBackService.createCollections(value.router).subscribe(b => {
					if (b) this.panelExtendService.launchSaveIndexedDB$.next();
				});
				const currentForDateElse = this.appDataService.currentAppDataForinPageData.eles;
				if (Array.isArray(currentForDateElse)) {
					this.panelScopeEnchantmentService.scopeEnchantmentModel.emptyAllProfile();
					this.panelExtendService.nextWidgetList(
						this.panelExtendService.handleFreeItemToPanelWidget(currentForDateElse)
					);
				}
			}
		});
		this.panelSaveIndexedDBRX$ = this.panelExtendService.launchSaveIndexedDB$.subscribe(() => {
			this.panelExtendMoveBackService.dbAdd();
		});
		this.widgetListChangeRX$ = this.panelExtendService.widgetList$.subscribe(list => {
			if (Array.isArray(list)) {
				this.appDataService.currentAppDataForinPageData.eles = this.panelExtendService.handleSaveWidgetToOrientationModelData();
			}
		});
		this.launchRecordPanelInfoRectRX$ = this.panelExtendService.launchRecordPanelInfoRect$.subscribe(() => {
            // 记录屏幕视图的页面位置信息
            if (this.panelEL.nativeElement) {
                this.panelInfo.setData(this.panelEL.nativeElement.getBoundingClientRect());
            }
		});
	}
	ngOnInit() {
		// 开启全局键盘快捷操作监听
		this.panelExtendQuickShortcutsService.openKeyboardEvent();
		// 先清空所有轮廓数据
		this.panelScopeEnchantmentService.scopeEnchantmentModel.emptyAllProfile();
		// 开启鼠标按下和松开的监听
		if (this.listenMouseDownRX$) this.listenMouseDownRX$.unsubscribe();
		this.listenMouseDownRX$ = fromEvent(this.panelMainEl.nativeElement, "mousedown").subscribe(
			(event: MouseEvent) => {
				this.zone.run(() => {
					// 记录初始坐标点
					this.panelExtendService.selectionRectModel.startCoord = [event.pageX, event.pageY];
					this.panelExtendService.launchRecordPanelInfoRect$.next();
					if (this.listenMouseMoveRX$) this.listenMouseMoveRX$.unsubscribe();
					this.listenMouseMoveRX$ = fromEvent(document, "mousemove").subscribe((move: MouseEvent) => {
						// 根据是否按下了空格键来决定鼠标按下的时候是rect选框还是拖动画布
						if (this.panelExtendService.isOpenSpacebarMove$.value) {
							this.acceptMouseScroll({
								deltaX: -move.movementX,
								deltaY: -move.movementY
							});
						} else {
							this.calcMouseMoveScrollTopBottom(move);
							this.panelExtendService.selectionRectModel.handleCoordShape([move.pageX, move.pageY]);
						}
					});
					if (this.listenMouseUpRX$) this.listenMouseUpRX$.unsubscribe();
					this.listenMouseUpRX$ = fromEvent(document, "mouseup").subscribe(() => {
						this.panelExtendService.selectionRectModel.nextLaunchRectData();
						this.panelExtendService.selectionRectModel.reset();
						if (this.listenMouseMoveRX$) this.listenMouseMoveRX$.unsubscribe();
						if (this.listenMouseUpRX$) this.listenMouseUpRX$.unsubscribe();
					});
				});
			}
		);
	}

	ngAfterViewInit() {
		this.panelExtendService.launchRecordPanelInfoRect$.next();
		// 初始化完成后计算面板的起始位置，确保顶部导航在页面最上面
		setTimeout(() => {
			const initTop = (this.panelInfo.height - 736) / 2;
			this.acceptScrollXY("y", { left: 0, top: (initTop * -1) / 1.8 });
		});
	}

	ngOnDestroy() {
		if (this.panelSaveIndexedDBRX$) this.panelSaveIndexedDBRX$.unsubscribe();
		if (this.launchCurrentPageDataRX$) this.launchCurrentPageDataRX$.unsubscribe();
		if (this.widgetListChangeRX$) this.widgetListChangeRX$.unsubscribe();
		if (this.launchRecordPanelInfoRectRX$) this.launchRecordPanelInfoRectRX$.unsubscribe();
		// 关闭全局键盘监听
		this.panelExtendQuickShortcutsService.closeKeyboardEvent();
	}

	/**
	 * 检测鼠标是否在屏幕的上下两个部分拖拽，从而自动滚动并计算滚动条
	 */
	public calcMouseMoveScrollTopBottom(move: MouseEvent): void {
		const top = move.clientY;
		const startCoord = this.panelExtendService.selectionRectModel.startCoord;
		const translateY = cloneDeep(this.transform.translateY);
		if (top < 50) {
			// 说明鼠标位于顶部导航
			this.acceptScrollXY("y", { left: 0, top: -5 });
		} else if (window.innerHeight - move.clientY < 0) {
			// 说明鼠标位于浏览器底部
			this.acceptScrollXY("y", { left: 0, top: 5 });
		}
		startCoord[1] = startCoord[1] + this.transform.translateY - translateY;
	}

	/**
	 * 创建右键菜单实例
	 */
	public acceptPanelContextMenu(event: MouseEvent, template: NzDropdownMenuComponent): void {
		this.nzContextMenuService.create(event, template);
	}

	/**
	 * 处理x轴或y轴拖动返回的回调
	 */
	public acceptScrollXY(type: "x" | "y", data: DraggablePort): void {
		const panelRectHeight = Math.abs(this.panelInfo.top) + this.panelInfo.height + Math.abs(this.panelInfo.bottom);
		const panelRectWidth = this.panelInfo.width;
		if (!panelRectHeight) this.panelExtendService.launchRecordPanelInfoRect$.next();
		if (type == "x" && data) {
			const beforLeft = cloneDeep(this.track.x.left);
			const newLeft = (((beforLeft / 100) * panelRectWidth + data.left) / panelRectWidth) * 100;
			this.track.acceptTrackMoveX({ left: newLeft });
			this.transform.translateX -= Math.round((this.track.x.left - beforLeft) * panelRectWidth * 0.018);
			this.panelExtendService.launchRecordPanelInfoRect$.next();
		} else if (type == "y" && data) {
			const beforTop = cloneDeep(this.track.y.top);
			const newTop = (((beforTop / 100) * panelRectHeight + data.top) / panelRectHeight) * 100;
			this.track.acceptTrackMoveY({ top: newTop });
			this.transform.translateY -= Math.round((this.track.y.top - beforTop) * panelRectHeight * 0.018);
			this.panelExtendService.launchRecordPanelInfoRect$.next();
		}
	}

	/**
	 * 接收鼠标的滚轮事件
	 * 改变滚动条的位置以及视图区域
	 */
	public acceptMouseScroll(delta: IMouseDelta): void {
		const panelRectHeight = Math.abs(this.panelInfo.top) + this.panelInfo.height + Math.abs(this.panelInfo.bottom);
		const panelRectWidth = this.panelInfo.width;
		const x = (((this.track.x.left / 100) * panelRectWidth + delta.deltaX) / panelRectWidth) * 100;
		const y = (((this.track.y.top / 100) * panelRectHeight + delta.deltaY) / panelRectHeight) * 100;
		this.track.acceptTrackMoveY({ top: y });
		this.track.acceptTrackMoveX({ left: x });
		if (y > 0 && y + this.track.y.height < 100) {
			this.transform.translateY -= Math.round(delta.deltaY * 1.8);
		}
		if (x > 0 && x + this.track.x.width < 100) {
			this.transform.translateX -= Math.round(delta.deltaX * 1.8);
		}
		this.panelExtendService.launchRecordPanelInfoRect$.next();
	}

	/**
	 * 接收全局的鼠标按下或松开事件
	 */
	public acceptMouseDownUp(type: "Down" | "Up"): void {
		// 改变手势
		if (this.panelExtendService.isOpenSpacebarMove$.value) this.isSpacebarMousedown = type == "Down" ? true : false;
		// 鼠标弹起之后取消所有的button的聚焦事件
		if (type == "Up") {
			const currentElement = document.activeElement;
			if (currentElement.tagName == "BUTTON") currentElement["blur"]();
		}
	}

	/**
	 * 接收主视图的鼠标按下事件
	 */
	public acceptFreePanelMainMouswDown(): void {
		// 默认取消所有profileOuterSphere$
		this.panelScopeEnchantmentService.scopeEnchantmentModel.emptyAllProfile();
	}

	/**
	 * 接收右键菜单点击粘贴的操作
	 * 或键盘的粘贴快捷操作
	 *
	 */
	public acceptPasteWidget(port: MouseEvent | { left: number; top: number }): void {
		if (port instanceof MouseEvent) {
			this.panelExtendQuickShortcutsService.performPasteWidgetInPanel({
				left: port.pageX - this.panelInfo.left,
				top: port.pageY - this.panelInfo.top
			});
		} else {
			this.panelExtendQuickShortcutsService.performPasteWidgetInPanel(port);
		}
	}
}
