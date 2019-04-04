import {
	ConventionSiteModel,
	PanelTextModel,
	PanelFacadeModel,
	PanelShadowModel,
	PanelFilterModel,
	PanelAnimationModel
} from "../../panel-widget-appearance/model";
import { isObject } from "@ng-public/util";
import { ProfileModel } from "../../panel-scope-enchantment/model";
import { EventModel } from "../../panel-event/event-handler";
import { HostItemModel } from "./host.model";
import { debounceTime, switchMap, map, tap, filter, mergeAll, concatAll } from "rxjs/operators";
import { get } from "lodash";
import { merge, zip, concat } from "rxjs";

/**
 * 拓展模式下的widget数据模型
 */
export class PanelWidgetModel extends HostItemModel {
	/**
	 * 该组件对应的轮廓数据
	 */
	public profileModel: ProfileModel = new ProfileModel();

	/**
	 * 该组件对应的事件数据
	 */
	public panelEventHandlerModel: EventModel = new EventModel();

	/**
	 * 该组件对应的外观样式数据
	 */
	public conventionSiteModel: ConventionSiteModel = new ConventionSiteModel();

	/**
	 * 该组件对应的文本设置样式数据
	 */
	public panelTextModel: PanelTextModel = new PanelTextModel();

	/**
	 * 该组件对应的边框设置样式数据
	 */
	public panelFacadeModel: PanelFacadeModel = new PanelFacadeModel();

	/**
	 * 该组件对应的阴影设置样式数据
	 */
	public panelShadowModel: PanelShadowModel = new PanelShadowModel();

	/**
	 * 该组件对应的滤镜设置样式数据
	 */
	public panelFilterModel: PanelFilterModel = new PanelFilterModel();

	/**
	 * 该组件对应的动画效果数据
	 */
	public panelAnimationModel: PanelAnimationModel = new PanelAnimationModel();

	/**
	 * 最终的映射到具体某个widget组件对象的样式数据
	 */
	public ultimatelyStyle: { [key: string]: string } = {};

	/** 是否进入到双击状态 */
	public isDblClick: boolean = false;
	/** 是否隐藏文字 */
	public isHiddenText: boolean = false;

	constructor(data?: HostItemModel) {
		super(data);
		// 初始化
		this.conversionStyleToUltimatelyStyle();
		this.panelInit();
		this.conventionInit();
		this.panelTextInit();
		this.panelFacadeInit();
		this.panelShadowInit();
		this.panelFilterInit();
		this.panelAnimationInit();
		this.panelEventHandlerInit();
		this.openSubValueChange();
	}

	/**
	 * 开启并订阅该widget类的可编辑的数据的所有更新变化，以用来实时更新autoWidget里的样式和事件数据
	 */
	public openSubValueChange(): void {
		merge(
			this.profileModel.valueChange$,
			this.conventionSiteModel.valueChange$,
			this.panelTextModel.valueChange$,
			this.panelFacadeModel.valueChange$,
			this.panelShadowModel.valueChange$,
			this.panelFilterModel.valueChange$,
			this.panelAnimationModel.valueChange$
		)
			.pipe(
				// 10毫秒内只取最新的最后一个值，避免重复计算
				debounceTime(1),
				tap(value => {
					if (value instanceof ProfileModel) {
						this.autoWidget.orientationmodel.left = value.left;
						this.autoWidget.orientationmodel.top = value.top;
						this.autoWidget.orientationmodel.width = value.width;
						this.autoWidget.orientationmodel.height = value.height;
						this.autoWidget.orientationmodel.rotate = value.rotate;
						this.autoWidget.orientationmodel.zIndex = value.zIndex;
					}
				})
			)
			.subscribe(() => {
				this.autoWidget.customfeature = this.panelEventHandlerModel.autoWidgetEvent;
				this.autoWidget.style.data = this.ultimatelyStyle;
			});
	}

	/**
	 * 获取该类上某个属性的值，没有则返回undefind
	 */
	public getObjKeyValue(key: string): any {
		if ((<Object>this).hasOwnProperty(key)) {
			return this[key];
		} else {
			return undefined;
		}
	}

	/**
	 * 为该类动态添加属性以及对应的值
	 */
	public addObjKeyValue(arg: { [key: string]: any }): void {
		if (arg && isObject(arg)) {
			const _this_obj_key = Object.keys(this);
			for (let e in arg) {
				if (_this_obj_key.includes(e)) {
					// 该行待考虑
				} else {
				}
				this[e] = arg[e];
			}
		}
	}

	/**
	 * 删除该类某个属性的keyvalue
	 */
	public delObjKeyValue(key: string): void {
		if ((<Object>this).hasOwnProperty(key)) {
			delete this[key];
		}
	}

	/**
	 * 把style.data里的样式值赋给ultimatelyStyle
	 */
	public conversionStyleToUltimatelyStyle(): void {
		if (get(this.autoWidget, "style.data")) {
			const _style = <Object>this.autoWidget.style.data;
			if (_style) {
				for (let e in _style) {
					this.ultimatelyStyle[e] = _style[e];
				}
			}
		}
	}

	/**
	 * 添加样式给ultimatelyStyle
	 */
	public addStyleToUltimatelyStyle(obj: { [key: string]: string }): void {
		if (isObject(obj)) {
			for (let e in obj) {
				this.ultimatelyStyle[e] = obj[e];
			}
		}
	}

	/**
	 * 删除某个样式于ultimatelyStyle
	 */
	public delStyleToUltimatelyStyle(key: string): void {
		if (isObject(this.ultimatelyStyle)) {
			for (let e in this.ultimatelyStyle) {
				if (e == key) {
					delete this.ultimatelyStyle[key];
					break;
				}
			}
		}
	}

	/**
	 * 初始化轮廓值
	 */
	public panelInit(): void {
		if (get(this.autoWidget, "orientationmodel")) {
			const _ori = this.autoWidget.orientationmodel;
			// 重新计算宽度和高度
			if ((<Object>this.ultimatelyStyle).hasOwnProperty("width") && this.ultimatelyStyle.width) {
				_ori.width = <any>this.ultimatelyStyle.width.replace("px", "") * 1;
			}
			if ((<Object>this.ultimatelyStyle).hasOwnProperty("height") && this.ultimatelyStyle.height) {
				_ori.height = <any>this.ultimatelyStyle.height.replace("px", "") * 1;
			}
			this.profileModel.setData({
				unit: "px",
				left: _ori.left,
				top: _ori.top,
				width: _ori.width,
				height: _ori.height,
				rotate: _ori.rotate,
				zIndex: _ori.zIndex
			});
			this.profileModel.setMouseCoord([this.profileModel.left, this.profileModel.top]);
		}
	}

	/**
	 * 初始化外观值
	 */
	public conventionInit(): void {
		if (get(this.autoWidget, "orientationmodel") && get(this.autoWidget, "style.data")) {
			const _ori = this.autoWidget.orientationmodel;
			const _opacity = (<Object>this.autoWidget.style.data).hasOwnProperty("opacity")
				? this.autoWidget.style.data.opacity * 100
				: 100;
			this.conventionSiteModel.setData({
				opacity: _opacity,
				left: _ori.left,
				top: _ori.top,
				width: _ori.width,
				height: _ori.height,
				rotate: _ori.rotate
			});
		}
	}

	/**
	 * 初始化文本设置值
	 */
	public panelTextInit(): void {
		if (get(this.autoWidget, "orientationmodel")) {
			const _ori = this.autoWidget.orientationmodel;
			const _style = <Object>this.ultimatelyStyle;
			let _set_obj = {};
			_set_obj["height"] = _ori.height;
			if (_style.hasOwnProperty("font-size")) _set_obj["fontSize"] = _style["font-size"].replace("px", "");
			if (_style.hasOwnProperty("font-weight"))
				_set_obj["isBold"] = _style["font-weight"] == "bold" ? true : false;
			if (_style.hasOwnProperty("font-style"))
				_set_obj["isItalic"] = _style["font-style"] == "italic" ? true : false;
			if (_style.hasOwnProperty("text-decoration")) {
				if (_style["text-decoration"] == "underline") {
					_set_obj["lineationType"] = "bottom";
				} else if (_style["text-decoration"] == "line-through") {
					_set_obj["lineationType"] = "center";
				}
			}
			if (_style.hasOwnProperty("color")) _set_obj["fontColor"] = _style["color"];
			if (_style.hasOwnProperty("text-align")) _set_obj["crosswiseType"] = _style["text-align"];
			if (
				_style.hasOwnProperty("font-size") &&
				_style.hasOwnProperty("line-height") &&
				_style.hasOwnProperty("height")
			) {
				const _font_size = _style["font-size"].replace("px", "") * 1;
				const _line_height = _style["line-height"].replace("px", "") * 1;
				const _height = _style["height"].replace("px", "") * 1;
				if (_font_size == _line_height) {
					_set_obj["verticalType"] = "top";
				} else if (_height == _line_height) {
					_set_obj["verticalType"] = "center";
				} else if (_height * 2 - _font_size == _line_height) {
					_set_obj["verticalType"] = "bottom";
				}
			}
			this.panelTextModel.setData(_set_obj);
		}
	}

	/**
	 * 初始化边框设置
	 */
	public panelFacadeInit(): void {
		if (this.ultimatelyStyle) {
			const _style = <Object>this.ultimatelyStyle;
			let _set_obj = {};
			if (_style.hasOwnProperty("background-color")) _set_obj["bgColor"] = _style["background-color"];
			if (_style.hasOwnProperty("border-color")) _set_obj["borderColor"] = _style["border-color"];
			if (_style.hasOwnProperty("border-style")) _set_obj["borderStyle"] = _style["border-style"];
			if (_style.hasOwnProperty("border-width"))
				_set_obj["borderNumber"] = _style["border-width"].replace("px", "") * 1;
			if (_style.hasOwnProperty("border-radius") && _style["border-radius"]) {
				let _radius_arr = _style["border-radius"].split(" ");
				// 分四种情况
				if (Array.isArray(_radius_arr)) {
					_radius_arr = _radius_arr.map(_r => _r.replace("px", "") * 1);
					if (_radius_arr.length == 1) {
						// 四个边的圆角相同
						_set_obj["ltRadius"] = _radius_arr[0];
						_set_obj["rtRadius"] = _radius_arr[0];
						_set_obj["lbRadius"] = _radius_arr[0];
						_set_obj["rbRadius"] = _radius_arr[0];
					} else if (_radius_arr.length == 2) {
						// 左上右下 和 右上左下
						_set_obj["ltRadius"] = _radius_arr[0];
						_set_obj["rbRadius"] = _radius_arr[0];
						_set_obj["rtRadius"] = _radius_arr[1];
						_set_obj["lbRadius"] = _radius_arr[1];
					} else if (_radius_arr.length == 3) {
						// 左上 和 右上左下 和右下
						_set_obj["ltRadius"] = _radius_arr[0];
						_set_obj["rtRadius"] = _radius_arr[1];
						_set_obj["lbRadius"] = _radius_arr[1];
						_set_obj["rbRadius"] = _radius_arr[2];
					} else if (_radius_arr.length == 4) {
						// 左上 和 右上 和 右下 和 左下
						_set_obj["ltRadius"] = _radius_arr[0];
						_set_obj["rtRadius"] = _radius_arr[1];
						_set_obj["rbRadius"] = _radius_arr[2];
						_set_obj["lbRadius"] = _radius_arr[3];
					}
				}
			}
			this.panelFacadeModel.setData(_set_obj);
		}
	}

	/**
	 * 初始化阴影
	 */
	public panelShadowInit(): void {
		if (this.ultimatelyStyle) {
			const _style = <Object>this.ultimatelyStyle;
			let _shadow_obj = {};
			if (_style.hasOwnProperty("box-shadow") && _style["box-shadow"]) {
				let _shadow_arr = _style["box-shadow"].split(" ");
				if (Array.isArray(_shadow_arr)) {
					// 先抛弃颜色
					let _no_color = [];
					let _color = "";
					_shadow_arr.forEach(_s => {
						if (_s.includes("px")) {
							_no_color.push(_s.replace("px", "") * 1);
						} else {
							_color = _s;
						}
					});
					if (Array.isArray(_no_color)) {
						_shadow_obj["x"] = _no_color[0] == undefined ? 0 : _no_color[0];
						_shadow_obj["y"] = _no_color[1] == undefined ? 0 : _no_color[1];
						_shadow_obj["fuzzy"] = _no_color[2] == undefined ? 0 : _no_color[2];
						_shadow_obj["spread"] = _no_color[3] == undefined ? 0 : _no_color[3];
						_shadow_obj["color"] = _color;
					}
				}
				this.panelShadowModel.setData(_shadow_obj);
			}
		}
	}

	/**
	 * 初始化滤镜
	 * 只有图片组件才有滤镜
	 */
	public panelFilterInit(): void {
		if (this.ultimatelyStyle) {
			const _style = <Object>this.ultimatelyStyle;
			let _filter_obj = {};
			if (this.type == "picture" && _style.hasOwnProperty("filter") && _style["filter"]) {
				let _filter_arr = _style["filter"].split(" ");
				let _rep = (t: string): number => {
					return <any>t.replace(/[^\d\.]/g, "") * 1;
				};
				if (Array.isArray(_filter_arr)) {
					_filter_arr.forEach(_e => {
						if (_e.includes("blur")) _filter_obj["blur"] = _rep(_e);
						if (_e.includes("brightness")) _filter_obj["brightness"] = _rep(_e);
						if (_e.includes("contrast")) _filter_obj["contrast"] = _rep(_e);
						if (_e.includes("saturate")) _filter_obj["saturate"] = _rep(_e);
						if (_e.includes("grayscale")) _filter_obj["grayscale"] = _rep(_e);
						if (_e.includes("sepia")) _filter_obj["sepia"] = _rep(_e);
						if (_e.includes("hue-rotate")) _filter_obj["hueRotate"] = _rep(_e);
						if (_e.includes("invert")) _filter_obj["invert"] = _rep(_e);
					});
				}
				this.panelFilterModel.setData(_filter_obj);
			}
		}
	}

	/**
	 * 初始化动画效果
	 */
	public panelAnimationInit(): void {
		if (this.ultimatelyStyle) {
			const _style = <Object>this.ultimatelyStyle;
			let _animation_obj = {};
			if (_style.hasOwnProperty("animation-name") && _style["animation-name"])
				_animation_obj["animationName"] = _style["animation-name"];
			if (_style.hasOwnProperty("animation-delay") && _style["animation-delay"])
				_animation_obj["animationDelay"] = _style["animation-delay"].replace("s", "");
			if (_style.hasOwnProperty("animation-duration") && _style["animation-duration"])
				_animation_obj["animationDuration"] = _style["animation-duration"].replace("s", "");
			if (_style.hasOwnProperty("animation-iteration-count") && _style["animation-iteration-count"])
				_animation_obj["animationIterationCount"] = _style["animation-iteration-count"];
			this.panelAnimationModel.setData(_animation_obj);
		}
	}

	/**
	 * 初始化事件机制
	 */
	public panelEventHandlerInit(): void {
		if (get(this.autoWidget, "customfeature")) {
			const _event = this.autoWidget.customfeature;
			let _event_obj = {};
			if (_event.hasOwnProperty("eventHandler") && _event.eventHandler) {
				_event_obj["eventHandler"] = _event.eventHandler;
			}
			if (_event.hasOwnProperty("eventParams") && _event.eventParams) {
				_event_obj["eventParams"] = _event.eventParams;
			}
			this.panelEventHandlerModel.setData(_event_obj);
		}
	}
}
