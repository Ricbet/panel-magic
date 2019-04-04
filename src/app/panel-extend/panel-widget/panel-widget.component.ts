import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { PanelScopeEnchantmentService } from "../panel-scope-enchantment/panel-scope-enchantment.service";
import { PanelWidgetModel } from "./model";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { PanelScopeTextEditorModel } from "../panel-scope-enchantment/model";
import { PanelLayerService } from "../panel-layer/panel-layer.service";
import { PanelSeniorVesselEditService } from "../panel-senior-vessel-edit/panel-senior-vessel-edit.service";
import { PanelExtendService } from "../panel-extend.service";
import { fromEvent, Subscription } from "rxjs";

@Component({
	selector: "app-panel-widget",
	templateUrl: "./panel-widget.component.html",
	styleUrls: ["./panel-widget.component.scss"]
})
export class PanelWidgetComponent implements OnInit, OnChanges {
	// 根据配置项获取对应的模版标签
	private _widget: PanelWidgetModel;
	private _isProfile: boolean = true;
	private _isSimpleFunc: boolean = false;
	// 如果当前的组件是动态容器组件才有该属性，用于是否显示提示语句
	public isViseableVesselTip: boolean = false;

	@Input()
	public set widget(v: PanelWidgetModel) {
		this._widget = v;
	}
	public get widget(): PanelWidgetModel {
		return this._widget;
	}

	// 是否显示轮廓
	@Input()
	public set isProfile(v: boolean) {
		this._isProfile = v;
	}
	public get isProfile(): boolean {
		return this._isProfile;
	}

	// 是否开启简易版组件渲染方式，只显示组件样式，无任何功能
	@Input()
	public set isSimpleFunc(v: boolean) {
		this._isSimpleFunc = v;
	}
	public get isSimpleFunc(): boolean {
		return this._isSimpleFunc;
	}

	// 获取样式
	public get widgetStyle(): { [key: string]: string } {
		return this.widget.ultimatelyStyle;
	}

	constructor(
		private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService,
		private readonly panelExtendService: PanelExtendService,
		private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
		private readonly panelLayerService: PanelLayerService
	) {}

	ngOnInit() {}

	ngOnDestroy() {}

	ngAfterViewInit() {}

	ngOnChanges() {}

	/**
	 * 接收组件的鼠标移入和移出操作
	 */
	public acceptMouseMoveOut(type: "enter" | "out"): void {
		if (!this.isSimpleFunc) {
			if (this.isProfile) {
				this.panelScopeEnchantmentService.handleTemporaryProfile(this.widget, type);
			}
			this.panelLayerService.launchMouseEnterOut.next({ widget: this.widget, type: type });
		}
		this.isViseableVesselTip = type == "enter" ? true : false;
	}

	/**
	 * 点击某一个widget组件的回调
	 */
	public acceptWidgetChecked(event: MouseEvent): void {
		if (!this.isSimpleFunc) {
			event.stopPropagation();
			event.preventDefault();
			if (
				!this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value.some(
					_w => _w.uniqueId == this.widget.uniqueId
				)
			) {
				event.shiftKey == true
					? this.panelScopeEnchantmentService.toggleOuterSphereInsetWidget(this.widget)
					: this.panelScopeEnchantmentService.onlyOuterSphereInsetWidget(this.widget);
			} else {
				if (event.shiftKey == true) this.panelScopeEnchantmentService.toggleOuterSphereInsetWidget(this.widget);
			}
			this.openMouseMoveLaunch();
		}
	}

	/**
	 * 开启鼠标的坐标点传递发射
	 */
	public openMouseMoveLaunch(): void {
		if (!this.isSimpleFunc) {
			const _pro = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
			const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$
				.value;
			// 记录固定值和MouseCoord
			_pro.recordImmobilizationData();
			_pro.setMouseCoord([_pro.left, _pro.top]);
			const _offset_coord = this.panelScopeEnchantmentService.handleOuterSphereRotateOffsetCoord(_pro);
			_pro.setOffsetAmount(_offset_coord);
			if (Array.isArray(_inset_widget)) {
				_inset_widget.forEach(_w => {
					_w.profileModel.recordImmobilizationData();
					_w.profileModel.setMouseCoord([_w.profileModel.left, _w.profileModel.top]);
				});
			}
			let mouseMove$: Subscription;
			let mouseUp$: Subscription;
			// 是否保存到本地存储
			let isOpenSaveIndexedDB: boolean = false;
			mouseMove$ = fromEvent(document, "mousemove").subscribe(() => (isOpenSaveIndexedDB = true));
			mouseUp$ = fromEvent(document, "mouseup").subscribe(() => {
				if (mouseUp$) mouseUp$.unsubscribe();
				if (mouseMove$) mouseMove$.unsubscribe();
				// 记录主轮廓的鼠标坐标点与实际样式坐标的差值
				const _pro = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere;
				_pro.resetAuxl();
				if (isOpenSaveIndexedDB) {
					this.panelExtendService.launchSaveIndexedDB$.next();
				}
			});
		}
	}

	/**
	 * 拖拽返回的鼠标坐标点增量
	 */
	public acceptDraggableIncrement(data: DraggablePort): void {
		if (data && !this.isSimpleFunc) {
			this.panelScopeEnchantmentService.launchMouseIncrement$.next(data);
		}
	}

	/**
	 * 双击widget组件
	 */
	public acceptDoubleClick(): void {
		if (!this.isSimpleFunc) {
			if (this.widget.type == "text" || this.widget.type == "button") {
				const _text_editor = new PanelScopeTextEditorModel();
				const _content = this.widget.autoWidget.content;
				const _pro = this.widget.conventionSiteModel;
				const _border = this.widget.panelFacadeModel;
				const _text_widget = this.widget.panelTextModel;
				const _style_widget = this.widget.ultimatelyStyle;
				_text_editor.setData({
					width: _pro.width,
					height: _pro.height,
					left: _pro.left,
					top: _pro.top,
					borderNumber: _border.borderStyle == "none" ? 0 : _border.borderNumber,
					textAlign: <"center" | "left" | "right">_text_widget.crosswiseType,
					fontSize: _text_widget.fontSize,
					fontWeight: _text_widget.isBold ? "bold" : "normal",
					fontStyle: _text_widget.isItalic ? "italic" : "normal",
					textDecoration:
						_text_widget.lineationType == "bottom"
							? "underline"
							: _text_widget.lineationType == "center"
							? "line-through"
							: "initial",
					lineHeight: <any>_style_widget["line-height"].replace("px", "") * 1,
					color: _text_widget.fontColor,
					text: _content
				});
				// 同时隐藏掉widget里的文字
				this.widget.isHiddenText = true;
				this.panelScopeEnchantmentService.panelScopeTextEditorModel$.next(_text_editor);
			} else if (this.widget.type == "picture") {
				// 如果是图片组件则双击显示图片选择
				// this.imageGalleryService.open({
				// })
			} else if (this.widget.type == "seniorvessel") {
				// 进入动态容器面板模式
				this.panelSeniorVesselEditService.openEditVesselRoom(this.widget);
			}
		}
	}

	/**
	 * 接收组件的右键事件传递给enchantment轮廓组件
	 */
	public acceptWidgetRightClick(event: MouseEvent): void {
		if (!this.isSimpleFunc) {
			event.stopPropagation();
			this.panelScopeEnchantmentService.launchContextmenu$.next(event);
		}
	}
}
