import { BehaviorSubject, never, Observable } from "rxjs";
import { ProfileModel } from "./profile.model";
import { PanelWidgetModel } from "../../panel-widget/model";
import { CornerPinModel, CCursorStyle } from "./corner-pin.model";
import { OuterSphereHasAuxlModel } from "./outer-sphere-has-auxl.model";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { cloneDeep } from "lodash";
import { Injector } from "@angular/core";

/**
 * 此类非常重要
 *
 * 它是描述组件的可编辑选项内容，选中的任何组件都被该类继承，以实现更为复杂的样式编辑操作
 *
 */
export class ScopeEnchantmentModel {
	// 最外层的主轮廓,有且只能有一个
	public profileOuterSphere$: BehaviorSubject<OuterSphereHasAuxlModel> = new BehaviorSubject(null);
	// 鼠标移入呈现的轮廓,有且只能有一个
	public profileTemporary$: BehaviorSubject<ProfileModel> = new BehaviorSubject(null);
	// 主轮廓里面的所有被选组件列表
	public outerSphereInsetWidgetList$: BehaviorSubject<Array<PanelWidgetModel>> = new BehaviorSubject([]);

	// 八个拖拽点
	public cornerPinList$: BehaviorSubject<Array<CornerPinModel>> = new BehaviorSubject([]);
	// 八个位置点
	public cornerLocationPinList$: BehaviorSubject<Array<CornerPinModel>> = new BehaviorSubject([]);
	// 八个位置对应的鼠标样式数组
	public curnerStyleCursorList$: BehaviorSubject<Array<string>> = new BehaviorSubject([]);

	constructor() {}

	/**
	 * 获取最外层主轮廓profileOuterSphere$的value值
	 */
	public get valueProfileOuterSphere(): OuterSphereHasAuxlModel {
		return this.profileOuterSphere$.value;
	}

	/**
	 * 清除八个拖拽点
	 */
	public emptyAllCornerPinList(): void {
		this.cornerPinList$.next([]);
		this.cornerLocationPinList$.next([]);
		this.curnerStyleCursorList$.next([]);
	}

	/**
	 * 切换外层主轮廓的isCheck状态
	 */
	public toggleProfileOuterSphereIsCheckStatus$(bool: boolean): void {
		const _pro = this.valueProfileOuterSphere;
		if (_pro) {
			_pro.isCheck = bool;
			this.profileOuterSphere$.next(_pro);
		}
	}

	/**
	 * 重置profileTemporary$
	 */
	public resetProfileTemporary$(): void {
		this.profileTemporary$.next(null);
	}

	/**
	 * 重置outerSphereInsetWidgetList$
	 */
	public resetOuterSphereInsetWidgetList$(): void {
		this.outerSphereInsetWidgetList$.value.map(_e => (_e.profileModel.isCheck = false));
		this.outerSphereInsetWidgetList$.next([]);
	}

	/**
	 * 清空所有profileOuterSphere$选中状态
	 */
	public emptyAllProfile(): void {
		this.profileOuterSphere$.next(null);
		this.profileTemporary$.next(null);
		this.resetOuterSphereInsetWidgetList$();
		this.cornerPinList$.next([]);
		this.cornerLocationPinList$.next([]);
	}

	/**
	 * 赋值profileOuterSphere
	 * 参数isLaunch表示是否允许发射数据源
	 */
	public launchProfileOuterSphere(arg: OuterSphereHasAuxlModel, isLaunch: boolean): void {
		if (isLaunch == true) {
			this.profileOuterSphere$.next(arg);
		} else {
			this.valueProfileOuterSphere.setData({
				left: arg.left,
				top: arg.top,
				width: arg.width,
				height: arg.height
			});
			this.valueProfileOuterSphere.isRotate = arg.isRotate;
			this.valueProfileOuterSphere.setMouseCoord(arg.mouseCoord);
		}
	}

	/**
	 * 计算主轮廓的位置
	 */
	public handleProfileOuterSphereLocationInsetWidget(increment: DraggablePort): void {
		const _pro = this.valueProfileOuterSphere;
		_pro.mouseCoord[0] += increment.left;
		_pro.mouseCoord[1] += increment.top;
		_pro.setData({
			left: _pro.left + increment.left,
			top: _pro.top + increment.top
		});
	}

	/**
	 * 根据主轮廓的位置计算轮廓内被选组件的位置
	 */
	public handleLocationInsetWidget(
		increment: DraggablePort,
		_all_widget: Array<PanelWidgetModel> = this.outerSphereInsetWidgetList$.value
	): void {
		if (Array.isArray(_all_widget)) {
			const _pro = this.valueProfileOuterSphere;
			// 所有轮廓内的组件计算位置
			_all_widget.forEach(_w => {
				_w.profileModel.mouseCoord[0] += increment.left;
				_w.profileModel.mouseCoord[1] += increment.top;
				let _obj = { left: _w.profileModel.mouseCoord[0], top: _w.profileModel.mouseCoord[1] };
				if (!(_pro.lLine || _pro.rLine || _pro.vcLine)) {
					_obj.left = _w.profileModel.mouseCoord[0];
					_pro.left = _pro.mouseCoord[0];
				} else {
					_obj.left += _pro.left - _pro.mouseCoord[0];
				}
				if (!(_pro.tLine || _pro.bLine || _pro.hcLine)) {
					_obj.top = _w.profileModel.mouseCoord[1];
					_pro.top = _pro.mouseCoord[1];
				} else {
					_obj.top += _pro.top - _pro.mouseCoord[1];
				}
				_w.profileModel.setData(_obj);
				/**
				 * 如果被选的所有组件当中有组合组件combination，则需要重新计算其子集的所有widget轮廓数值
				 */
				if (_w.type == "combination") {
					this.handleLocationInsetWidget(increment, _w.autoWidget.content);
				}
			});
		}
	}

	/**
	 * 生成八个方位点
	 */
	public handleCreateErightCornerPin(): void {
		// 先生成八个手势点
		let _cursors = Array.from(
			{ length: 8 },
			(_e, _i) =>
				new CornerPinModel({
					type: "cursor",
					cursor: _i
				})
		);
		// 再生成八个位置点
		let _location = Array.from(
			{ length: 8 },
			(_e, _i) =>
				new CornerPinModel({
					type: "location",
					location: _i
				})
		);
		this.cornerPinList$.next(_cursors);
		this.cornerLocationPinList$.next(_location);
		this.curnerStyleCursorList$.next(CCursorStyle);
	}

	/**
	 * 根据传入的角度改变八个拖拽点的位置
	 * 分为米字形，分别在以下角度才需要把数组属性向左转移
	 * 30 60 120 150 210 240 300 330
	 */
	public handleCursorPinStyle(rotate: number): void {
		const _rotate = rotate;
		const _move_obj = {
			0: _rotate >= 0 && _rotate < 30,
			1: _rotate >= 30 && _rotate < 60,
			2: _rotate >= 60 && _rotate < 120,
			3: _rotate >= 120 && _rotate < 150,
			4: _rotate >= 150 && _rotate < 210,
			5: _rotate >= 210 && _rotate < 240,
			6: _rotate >= 240 && _rotate < 300,
			7: _rotate >= 300 && _rotate < 330,
			8: _rotate >= 300 && _rotate < 360
		};
		let _current_move_index: number = 0;
		for (let e in _move_obj) {
			if (_move_obj[e] == true) {
				_current_move_index = <number>(<any>e);
				break;
			}
		}
		let _slice_pin = CCursorStyle.slice(0, _current_move_index);
		let _slice_end_pin = CCursorStyle.slice(_current_move_index, 8);
		this.curnerStyleCursorList$.next(_slice_end_pin.concat(_slice_pin));
	}
}
