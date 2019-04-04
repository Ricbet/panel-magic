import { Component, OnInit, ViewChild, OnDestroy, NgZone, TemplateRef } from "@angular/core";
import { PanelScopeEnchantmentService } from "./panel-scope-enchantment.service";
import {
	ScopeEnchantmentModel,
	AuxliLineModel,
	CornerPinModel,
	PanelScopeTextEditorModel,
	OuterSphereHasAuxlModel,
	ClipPathMaskModel
} from "./model";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { Subscription, BehaviorSubject, fromEvent } from "rxjs";
import { PanelExtendService } from "../panel-extend.service";
import { debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import { ILocation } from "../model";
import { NzContextMenuService, NzDropdownMenuComponent } from "ng-zorro-antd";
import { PanelScopeTextEditorComponent } from "./panel-scope-text-editor/panel-scope-text-editor.component";
import { cloneDeep } from "lodash";
import { DraggableTensileCursorService } from "./draggable-tensile-cursor.service";
import { ClipPathResizeMaskService } from "./clip-path-resize-mask.service";
import { PanelScaleplateService } from "../panel-scaleplate/panel-scaleplate.service";
import { PanelExtendQuickShortcutsService } from "../panel-extend-quick-shortcuts.service";
import { PanelAssistArborService } from "../panel-assist-arbor/panel-assist-arbor.service";
import { PanelSoulService } from "../panel-soul/panel-soul.service";
import { PanelWidgetModel } from "../panel-widget/model";

@Component({
	selector: "app-panel-scope-enchantment",
	templateUrl: "./panel-scope-enchantment.component.html",
	styleUrls: ["./panel-scope-enchantment.component.scss", "./panel-scope-corner-pin.scss"]
})
export class PanelScopeEnchantmentComponent implements OnInit, OnDestroy {
	@ViewChild("widgetContextMenuEl", { static: true }) public widgetContextMenuEl: NzDropdownMenuComponent;
	@ViewChild("panelScopeTextEditorComponentEl", { static: false })
    public panelScopeTextEditorComponentEl: PanelScopeTextEditorComponent;
	// 订阅待创建的组件（从左侧组件库里拖拽生成出来的新的组件）;
	private awaitWidgetVesselRX$: Subscription;

	private mouseIntcrementRX$: Subscription;
	private mouseContextMenu$: Subscription;
	private profileOuterSphereRX$: Subscription;
	private profileOuterSphereRotateRX$: Subscription;
	private rectRX$: Subscription;
	private clipPathRX$: Subscription;

	public get scopeEnchantment(): ScopeEnchantmentModel {
		return this.panelScopeEnchantmentService.scopeEnchantmentModel;
	}
	// 文本编辑器模式
	public get panelScopeTextEditor$(): BehaviorSubject<PanelScopeTextEditorModel> {
		return this.panelScopeEnchantmentService.panelScopeTextEditorModel$;
	}
	// 剪贴蒙版
	public get clipPathMask(): ClipPathMaskModel {
		return this.clipPathService.clipPathMaskModel;
	}
	// 是否允许设置组合，需要选中多个组件才能创建组合
	public get isCombination(): boolean {
		return this.panelAssistArborService.isCombination;
	}
	// 是否允许设置打散，需要备选组件当中有组合元素组件
	public get isDisperse(): boolean {
		return this.panelAssistArborService.isDisperse;
	}

	// 当前选中的唯一一个widget组件
	public get onlyOneWidgetInfo(): PanelWidgetModel {
		const _ = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
		return Array.isArray(_) && _.length == 1 ? _[0] : null;
	}

	constructor(
		public readonly clipPathService: ClipPathResizeMaskService,
		private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
		private readonly panelSoulService: PanelSoulService,
		private readonly panelExtendService: PanelExtendService,
		private readonly draggableTensileCursorService: DraggableTensileCursorService,
		private readonly panelExtendQuickShortcutsService: PanelExtendQuickShortcutsService,
		private readonly panelAssistArborService: PanelAssistArborService,
		private readonly panelScaleplateService: PanelScaleplateService,
		private readonly zone: NgZone,
		private readonly nzContextMenuService: NzContextMenuService
	) {
		// 待创建的新的组件订阅
		this.awaitWidgetVesselRX$ = this.panelSoulService.awaitWidgetVessel$.subscribe(value => {
			if (value) {
				console.log(value, "awaitwidget");
			}
		});

		// 右键
		this.mouseContextMenu$ = this.panelScopeEnchantmentService.launchContextmenu$.subscribe(event => {
			// 生成右键菜单
			if (event) this.nzContextMenuService.create(event, this.widgetContextMenuEl);
		});

		this.mouseIntcrementRX$ = this.panelScopeEnchantmentService.launchMouseIncrement$
			.pipe()
			.subscribe((drag: DraggablePort) => {
				if (drag) {
					this.handleProfileOuterSphereLocation(drag);
				}
			});

		this.rectRX$ = this.panelExtendService.selectionRectModel.launchRectData.subscribe(port => {
			this.handleRectInsetWidget(port);
		});

		// 剪贴蒙版的订阅
		this.clipPathRX$ = this.clipPathMask.currentPathType$.subscribe(() => {
			const _inset_widget = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
			if (_inset_widget.length == 1 && _inset_widget[0].type == "picture") {
			}
		});

		// 生成完主轮廓之后计算其余组件的横线和竖线情况并保存起来
		// 同时取消文本编辑器模式
		this.profileOuterSphereRX$ = this.scopeEnchantment.profileOuterSphere$.pipe().subscribe(value => {
			const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$
				.value;
			if (value) {
				this.createAllLineSave();
				// 主轮廓创建完成就开启角度值监听
				this.openRotateSubject(value);
				// 根据角度计算主轮廓的offset坐标增量
				const _value = cloneDeep(value);
				const _offset_coord = this.panelScopeEnchantmentService.handleOuterSphereRotateOffsetCoord(_value);
				value.setOffsetAmount(_offset_coord);
				// 开始记录所有被选组件的位置比例
				_inset_widget.forEach(_w => {
					_w.profileModel.recordInsetProOuterSphereFourProportion(value);
				});
			}
			this.panelScopeEnchantmentService.panelScopeTextEditorModel$.next(null);
			this.clipPathService.emptyClipPath();
		});
	}

	ngOnInit() {}

	ngOnDestroy() {
		if (this.mouseIntcrementRX$) this.mouseIntcrementRX$.unsubscribe();
		if (this.mouseContextMenu$) this.mouseContextMenu$.unsubscribe();
		if (this.rectRX$) this.rectRX$.unsubscribe();
		if (this.profileOuterSphereRX$) this.profileOuterSphereRX$.unsubscribe();
		if (this.profileOuterSphereRotateRX$) this.profileOuterSphereRotateRX$.unsubscribe();
		if (this.clipPathRX$) this.clipPathRX$.unsubscribe();
		if (this.awaitWidgetVesselRX$) this.awaitWidgetVesselRX$.unsubscribe();
	}

	/**
	 * 开启旋转角订阅
	 */
	public openRotateSubject(proOuter: OuterSphereHasAuxlModel): void {
		setTimeout(() => {
			this.scopeEnchantment.handleCursorPinStyle(
				this.panelScopeEnchantmentService.conversionRotateOneCircle(proOuter.rotate)
			);
		});
		if (this.profileOuterSphereRotateRX$) this.profileOuterSphereRotateRX$.unsubscribe();
		this.profileOuterSphereRotateRX$ = proOuter.valueChange$
			.pipe(
				map(_v => _v.rotate),
				debounceTime(1),
				distinctUntilChanged()
			)
			.subscribe(value => {
				this.scopeEnchantment.handleCursorPinStyle(
					this.panelScopeEnchantmentService.conversionRotateOneCircle(value)
				);
			});
	}

	/**
	 * 根据鼠标偏移的增量来处理计算主轮廓的位置
	 */
	public handleProfileOuterSphereLocation(drag: DraggablePort): void {
		// 计算主轮廓的位置
		this.scopeEnchantment.handleProfileOuterSphereLocationInsetWidget(drag);
		// 判断是否开启辅助线计算
		if (this.panelScopeEnchantmentService.isOpenAltCalc$.value) {
			// 同时把标尺已绘制的辅助线条并入到auxliLineModel里面！！！！
			const _h_line = this.panelScaleplateService.canvasScaleplateModel.hLineList$.value;
			const _v_line = this.panelScaleplateService.canvasScaleplateModel.vLineList$.value;
			const _auxli = this.panelScopeEnchantmentService.auxliLineModel$.value;
			if (Array.isArray(_h_line) && _h_line.length > 0) {
				_auxli.vLineList = _auxli.vLineList.concat(_h_line.map(_v => _v.inCanvasNum));
			}
			if (Array.isArray(_v_line) && _v_line.length > 0) {
				_auxli.hLineList = _auxli.hLineList.concat(_v_line.map(_v => _v.inCanvasNum));
			}
			_auxli.handleSetData();
			this.panelScopeEnchantmentService.auxliLineModel$.next(_auxli);
			this.panelScopeEnchantmentService.handleAuxlineCalculate();
		} else {
			this.scopeEnchantment.valueProfileOuterSphere.resetAuxl();
		}
		// 计算主轮廓内所有被选组件的位置
		this.scopeEnchantment.handleLocationInsetWidget(drag);
	}

	/**
	 * 根据rect矩形判断是否有组件在这个范围内，是的话则选中
	 * 实现多选效果
	 * 判断依据是大于左下角，小于右上角
	 */
	public handleRectInsetWidget(port: ILocation): void {
		const _all_widget = this.panelExtendService.valueWidgetList();
		const _panel_info = this.panelExtendService.panelInfoModel;
		let _resut_arr = [];
		if (port.width != 0 && port.height != 0) {
			_all_widget.forEach(_w => {
				let _offset_coord = { left: 0, top: 0 };
				if (_w.profileModel.rotate != 0)
					_offset_coord = this.panelScopeEnchantmentService.handleOuterSphereRotateOffsetCoord(
						_w.profileModel
					);
				let _t_left = _panel_info.left + _w.profileModel.left + _offset_coord.left;
				let _t_bottom = _panel_info.top + _w.profileModel.height + _w.profileModel.top + _offset_coord.top * -1;
				let _t_right = _t_left + _w.profileModel.width + _offset_coord.left * -2;
				let _t_top = _t_bottom - _w.profileModel.height + _offset_coord.top * 2;
				if (
					_t_left > port.left &&
					_t_bottom < port.top + port.height &&
					_t_right < port.left + port.width &&
					_t_top > port.top
				) {
					_resut_arr.push(_w);
				}
			});
			this.panelScopeEnchantmentService.pushOuterSphereInsetWidget(_resut_arr);
		}
	}

	/**
	 * 生成完主轮廓之后遍历其他不在主轮廓内的组件的横线和竖线
	 * 计算并保存起来
	 */
	public createAllLineSave(): void {
		const _other_widget_list = this.panelExtendService.valueWidgetList();
		const _auxli = new AuxliLineModel();
		const _panel_info = this.panelExtendService.panelInfoModel;
		const _fn_offset = this.panelScopeEnchantmentService.handleOuterSphereRotateOffsetCoord.bind(
			this.panelScopeEnchantmentService
		);
		if (Array.isArray(_other_widget_list)) {
			_auxli.vLineList.push(0, _panel_info.width);
			_auxli.hLineList.push(0, _panel_info.height);
			_auxli.vcLineList.push(_panel_info.width / 2);
			_auxli.hcLineList.push(_panel_info.height / 2);
			for (let i: number = 0, l = _other_widget_list.length; i < l; i++) {
				const _pro = _other_widget_list[i].profileModel;
				const _offset_coor = _fn_offset(_other_widget_list[i].profileModel);
				if (_pro.isCheck == false) {
					const _l_left = _pro.left + _offset_coor.left;
					const _l_right = _pro.left + _pro.width + _offset_coor.left * -1;
					const _l_top = _pro.top + _offset_coor.top;
					const _l_bottom = _pro.top + _pro.height + _offset_coor.top * -1;
					_auxli.vLineList.push(_l_left, _l_right);
					_auxli.hLineList.push(_l_top, _l_bottom);
					_auxli.vcLineList.push(_l_left + _pro.width / 2);
					_auxli.hcLineList.push(_l_top + _pro.height / 2);
				}
			}
			_auxli.handleSetData();
			this.panelScopeEnchantmentService.auxliLineModel$.next(_auxli);
		}
	}

	/**
	 * 八个拖拽点按下的时候记录组件的固定值
	 * 以及被选组件的固定值
	 */
	public acceptDraggableMouseDown(): void {
		const _pro = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
		const _inset_widget = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
		_pro.recordImmobilizationData();
		_pro.setMouseCoord([_pro.left, _pro.top]);
		if (Array.isArray(_inset_widget)) {
			_inset_widget.forEach(_e => {
				_e.profileModel.recordImmobilizationData();
				_e.profileModel.setMouseCoord([_e.profileModel.left, _e.profileModel.top]);
			});
		}
	}

	/**
	 * 接收旋转角度的按下事件
	 */
	public acceptRotateIco(mouse: MouseEvent): void {
		// 转弧度为度数的公式为 Math.atan( x )*180/Math.PI
		mouse.stopPropagation();
		let _mouse_move$: Subscription;
		let _mouse_up$: Subscription;
		const _pro = this.scopeEnchantment.valueProfileOuterSphere;
		const _panel_info = this.panelExtendService.panelInfoModel;
		const _panel_service = this.panelScopeEnchantmentService;
		let _rotate: number = null;
		_mouse_move$ = fromEvent(document, "mousemove").subscribe((move: MouseEvent) => {
			this.zone.run(() => {
				// 记录轮廓中心坐标点
				const _pro_center_coor = [
					_pro.left + _pro.width / 2 + _panel_info.left,
					_pro.top + _pro.height / 2 + _panel_info.top
				];
				let _handle_x = move.pageX - _pro_center_coor[0];
				let _handle_y = _pro_center_coor[1] - move.pageY;
				_rotate = _panel_service.conversionTwoCoordToRotate([_handle_x, _handle_y]);
				this.scopeEnchantment.valueProfileOuterSphere.setData({ rotate: _rotate });
				this.scopeEnchantment.outerSphereInsetWidgetList$.value.forEach(_e => {
					_e.profileModel.setData({ rotate: _rotate });
				});
			});
		});
		_mouse_up$ = fromEvent(document, "mouseup").subscribe(() => {
			this.zone.run(() => {
				if (_mouse_move$) _mouse_move$.unsubscribe();
				if (_mouse_up$) _mouse_up$.unsubscribe();
			});
		});
	}

	/**
	 * 接受八个拖拽点移动的回调
	 * 同时重新记录被选组件在主轮廓里的位置比例
	 */
	public acceptDraggableCursor(drag: DraggablePort, corner: CornerPinModel): void {
		const _inset_widget = this.scopeEnchantment.outerSphereInsetWidgetList$.value;
		const _pro = this.scopeEnchantment.valueProfileOuterSphere;
		if (_pro && Array.isArray(_inset_widget)) {
			_inset_widget.forEach(_w => {
				_w.profileModel.recordInsetProOuterSphereFourProportion(this.scopeEnchantment.valueProfileOuterSphere);
			});
		}
		this.draggableTensileCursorService.acceptDraggableCursor(drag, corner);
	}

	public handleZIndexTopOrBottom(type: "top" | "bottom"): void {
		this.panelExtendService.handleZIndexTopOrBottom(this.scopeEnchantment.outerSphereInsetWidgetList$.value, type);
	}

	public copyWidgetInsetPaste(): void {
		this.panelExtendQuickShortcutsService.performCopy();
	}

	public cutWidgetInsetPaste(): void {
		this.panelExtendQuickShortcutsService.performCutWidget();
	}

	public delWidget(): void {
		this.panelExtendQuickShortcutsService.performDelWidget();
	}

	public createCombination(): void {
		this.panelAssistArborService.launchCreateCombination$.next();
	}

	public disperseCombination(): void {
		this.panelAssistArborService.launchDisperseCombination$.next();
	}
}
