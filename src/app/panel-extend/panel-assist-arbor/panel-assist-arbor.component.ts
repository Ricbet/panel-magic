import { Component, OnInit } from "@angular/core";
import { PanelExtendMoveBackService } from "../panel-extend-move-back.service";
import { Subscription } from "rxjs";
import { PanelExtendService } from "../panel-extend.service";
import { PanelScopeEnchantmentService } from "../panel-scope-enchantment/panel-scope-enchantment.service";
import { PanelSoulService } from "../panel-soul/panel-soul.service";
import { PanelWidgetModel } from "../panel-widget/model";
import { cloneDeep } from "lodash";
import { debounceTime } from "rxjs/operators";
import { CombinationWidgetModel } from "../panel-scope-enchantment/model";
import { PanelAssistArborService } from "./panel-assist-arbor.service";
import { environment } from "environments/environment";

@Component({
	selector: "app-panel-assist-arbor",
	templateUrl: "./panel-assist-arbor.component.html",
	styleUrls: ["./panel-assist-arbor.component.scss", "./dropdown.scss"]
})
export class PanelAssistArborComponent implements OnInit {
	public environment = environment;
	// 订阅本地数据库DB发射过来的数据集
	private indexedDBDataRX$: Subscription;
	// 订阅轮廓值的创建
	private profileOuterSphereRX$: Subscription;
	// 订阅组合组件的轮廓值变化
	private combinationValueChangeRX$: Subscription;
	// 订阅鼠标移入组件和移出组件
	private temporaryProfileRX$: Subscription;
	// 订阅组合
	private createComRX$: Subscription;
	// 订阅打散
	private disperseComRX$: Subscription;
	// 是否允许前进
	public get isMove(): boolean {
		return this.panelExtendMoveBackService.currentMoveBackInfoValue.isMove;
	}
	// 是否允许后退
	public get isBack(): boolean {
		return this.panelExtendMoveBackService.currentMoveBackInfoValue.isBack;
	}
	// 是否允许设置组合，需要选中多个组件才能创建组合
	public get isCombination(): boolean {
		return this.panelAssistArborService.isCombination;
	}
	// 是否允许设置打散，需要备选组件当中有组合元素组件
	public get isDisperse(): boolean {
		return this.panelAssistArborService.isDisperse;
	}

	constructor(
		private readonly panelExtendMoveBackService: PanelExtendMoveBackService,
		private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
		private readonly panelAssistArborService: PanelAssistArborService,
		private readonly panelSoulService: PanelSoulService,
		private readonly panelExtendService: PanelExtendService
	) {
		this.profileOuterSphereRX$ = this.panelScopeEnchantmentService.scopeEnchantmentModel.profileOuterSphere$.subscribe(
			pro => {
				if (pro) {
					this.combinationValueChangeRX$ = pro.valueChange$.pipe(debounceTime(1)).subscribe(() => {
						const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel
							.outerSphereInsetWidgetList$.value;
						if (Array.isArray(_inset_widget)) {
							_inset_widget.forEach(_w => {
								if (_w.type == "combination" && Array.isArray(_w.autoWidget.content)) {
									_w.autoWidget.content.forEach(_c_w => {
										if (_c_w.profileModel.combinationWidgetData$) {
											this.handleCombinationAllChildWidgetProportion(_c_w);
										}
									});
								}
							});
						}
					});
				}
			}
		);
		this.temporaryProfileRX$ = this.panelScopeEnchantmentService.scopeEnchantmentModel.profileTemporary$.subscribe(
			value => {
				if (value) {
					// if (_com && _com.type == 'combination' ) {
					// this.handleCombinationChildWidgetProfileData(_com)
					// }
				}
			}
		);
		this.createComRX$ = this.panelAssistArborService.launchCreateCombination$.subscribe(() => {
			this.createCombination();
		});
		this.disperseComRX$ = this.panelAssistArborService.launchDisperseCombination$.subscribe(() => {
			this.disperseCombination();
		});
	}

	ngOnInit() {
		this.indexedDBDataRX$ = this.panelExtendMoveBackService.launchDBDataValue$.subscribe(res => {
			const _widget_list = JSON.parse(res.widgetList);
			if (Array.isArray(_widget_list)) {
				this.panelScopeEnchantmentService.scopeEnchantmentModel.emptyAllProfile();
				this.panelExtendService.nextWidgetList(
					this.panelExtendService.handleFreeItemToPanelWidget(_widget_list)
				);
			}
		});
	}

	ngOnDestroy() {
		if (this.indexedDBDataRX$) this.indexedDBDataRX$.unsubscribe();
		if (this.combinationValueChangeRX$) this.combinationValueChangeRX$.unsubscribe();
		if (this.profileOuterSphereRX$) this.profileOuterSphereRX$.unsubscribe();
		if (this.temporaryProfileRX$) this.temporaryProfileRX$.unsubscribe();
		if (this.createComRX$) this.createComRX$.unsubscribe();
		if (this.disperseComRX$) this.disperseComRX$.unsubscribe();
	}

	/**
	 * 拉伸组合组件的时候保证其所有子集组件的四个方位比例不变
	 * 根据childFourProportionObj计算
	 */
	public handleCombinationAllChildWidgetProportion(widget: PanelWidgetModel): void {
		const _widget_com = widget.profileModel.combinationWidgetData$.value;
		if (_widget_com && _widget_com.insetProOuterSphereFourProportion) {
			const _four_prop = _widget_com.insetProOuterSphereFourProportion;
			const _combination_pro = _widget_com.combinationRoom;
			_widget_com.left = _four_prop.left * _combination_pro.profileModel.width;
			_widget_com.top = _four_prop.top * _combination_pro.profileModel.height;
			_widget_com.width = _four_prop.right * _combination_pro.profileModel.width - _widget_com.left;
			_widget_com.height = _four_prop.bottom * _combination_pro.profileModel.height - _widget_com.top;
			widget.profileModel.setData({
				width: _widget_com.width,
				height: _widget_com.height
			});
			widget.addStyleToUltimatelyStyle({
				height: `${widget.profileModel.height}px`,
				width: `${widget.profileModel.width}px`
			});
		}
	}

	/**
	 * 接收前进和后退的回调
	 */
	public handleMoveBack(type: "move" | "back"): void {
		if (type == "back") {
			this.panelExtendMoveBackService.acquireBackDBData();
		} else if (type == "move") {
			this.panelExtendMoveBackService.acquireMoveDBData();
		}
	}

	/**
	 * 根据组合组件的轮廓值变化来计算其所有子集widget组件的轮廓数据
	 */
	public handleCombinationChildWidgetProfileData(combination: PanelWidgetModel): void {
		const _child_widget: Array<PanelWidgetModel> = combination.autoWidget.content;
		const _com_pro = combination.profileModel;
		if (Array.isArray(_child_widget)) {
			_child_widget.forEach(_w => {
				const _w_com = _w.profileModel.combinationWidgetData$.value;
				if (_w_com) {
					_w.profileModel.setData({
						rotate: this.panelScopeEnchantmentService.conversionRotateOneCircle(
							_w.profileModel.immobilizationData.rotate + _com_pro.rotate
						)
					});
					/**
					 * 利用圆的公式计算在旋转的时候子集组件的中心点在其对应的椭圆边上
					 * (x ** 2 ) + (y ** 2) == r ** 2
					 * 先记录子集组件在以combination的中心点为坐标系圆点计算其对应的坐标
					 * 半径_radius
					 */
					const _coordinates_x = _w_com.left - _com_pro.width / 2 + _w.profileModel.width / 2;
					const _coordinates_y = _com_pro.height / 2 - _w_com.top - _w.profileModel.height / 2;
					// 根据坐标和角度返回对应的新的坐标
					const _offset_coord = this.panelScopeEnchantmentService.conversionRotateNewCoordinates(
						[_coordinates_x, _coordinates_y],
						_com_pro.rotate
					);
					if (_offset_coord) {
						_w.profileModel.setData({
							left: _w.profileModel.left + _offset_coord.left,
							top: _w.profileModel.top + _offset_coord.top
						});
					}
					_w_com.removeInsetProOuterSphereFourProportion();
				}
			});
		}
	}

	/**
	 * 创建组合
	 * 创建之前保存原数据到indexedDB
	 */
	public createCombination(): void {
		if (this.isCombination) {
			this.panelExtendService.launchSaveIndexedDB$.next();
			let _panel_combination = this.panelSoulService.fixedWidget$.value.find(_e => _e.type == "combination");
			const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$
				.value;
			const _profile = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
			if (_panel_combination && _inset_widget.length > 1) {
				_panel_combination = cloneDeep(_panel_combination);
				let _combination_widget = new PanelWidgetModel(_panel_combination);
				let _await_inject_widget_uniqueId: Array<string | number> = [];
				// 待赋值的组合内组件列表
				let _await_inject_widget: Array<PanelWidgetModel> = this.handleDisperseWidgetList();
				// 先赋予组合组件宽高和位置
				_combination_widget.profileModel.setData({
					left: _profile.left,
					top: _profile.top,
					width: _profile.width,
					height: _profile.height
				});
				_inset_widget.forEach(_w => {
					_await_inject_widget_uniqueId.push(_w.uniqueId);
					if (_w.type != "combination") {
						_await_inject_widget.push(_w);
					}
				});
				_await_inject_widget.forEach((_w, _i) => {
					const _combination_data = new CombinationWidgetModel(_combination_widget);
					_combination_data.setData({
						left: _w.profileModel.left - _combination_widget.profileModel.left,
						top: _w.profileModel.top - _combination_widget.profileModel.top,
						width: _w.profileModel.width,
						height: _w.profileModel.height,
						rotate: _w.profileModel.rotate
					});
					_w.profileModel.combinationWidgetData$.next(_combination_data);
					// 计算子集组件在组合组件里的位置比例
					_w.profileModel.combinationWidgetData$.value.recordInsetProOuterSphereFourProportion();
					_w.profileModel.recordImmobilizationData();
				});
				_combination_widget.autoWidget.content = _await_inject_widget;
				// 先删除组合组件内的映射组件
				this.panelExtendService.deletePanelWidget(_await_inject_widget_uniqueId);
				// 再添加组合组件
				this.panelExtendService.addPanelWidget([_combination_widget]);
				// 再选中该组合组件
				this.panelScopeEnchantmentService.pushOuterSphereInsetWidget([_combination_widget]);
			}
		}
	}

	/**
	 * 打散组合
	 * 同时需要根据角度的不同计算left和top值，使其能够还原到组合前的位置
	 * 打散之前保存原数据到indexedDB
	 */
	public disperseCombination(): void {
		if (this.isDisperse) {
			this.panelExtendService.launchSaveIndexedDB$.next();
			// 从这些组合当中取出所有widget组件
			const _all_content_widget = this.handleDisperseWidgetList();
			const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$
				.value;
			// 待删除的组合组件的唯一id列表
			let _com_widget_uniqueId = _inset_widget.filter(_e => _e.type == "combination").map(_e => _e.uniqueId);
			// 先删除组合组件
			this.panelExtendService.deletePanelWidget(_com_widget_uniqueId);
			// 再添加_all_content_widget
			this.panelExtendService.addPanelWidget(_all_content_widget);
			// 再选中所传的组件列表
			this.panelScopeEnchantmentService.pushOuterSphereInsetWidget(_all_content_widget);
		}
	}

	/**
	 * 执行打散操作但不选中其轮廓
	 * 返回所有打散处理完的widget组件
	 * isAddPro参数表示是否加上差值
	 */
	public handleDisperseWidgetList(): Array<PanelWidgetModel> {
		const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
		let _all_content_widget = [];
		_inset_widget.forEach(_w => {
			if (_w.type == "combination" && Array.isArray(_w.autoWidget.content)) {
				this.handleCombinationChildWidgetProfileData(_w);
				_w.autoWidget.content.forEach((_e: PanelWidgetModel, _i) => {
					// _e = cloneDeep(_e)
					_all_content_widget.push(_e);
				});
			}
		});
		return _all_content_widget;
	}
}
