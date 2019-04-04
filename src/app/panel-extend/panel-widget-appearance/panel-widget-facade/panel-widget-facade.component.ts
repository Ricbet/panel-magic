import { Component, OnInit, Input, SimpleChanges, Output } from "@angular/core";
import { PanelWidgetAppearanceService } from "../panel-widget-appearance.service";
import { PanelFacadeModel } from "../model";
import { PanelScopeEnchantmentService } from "../../panel-scope-enchantment/panel-scope-enchantment.service";
import { PanelWidgetModel } from "../../panel-widget/model";
import { Subscription, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
	selector: "app-panel-widget-facade",
	templateUrl: "./panel-widget-facade.component.html",
	styleUrls: ["./panel-widget-facade.component.scss"]
})
export class PanelWidgetFacadeComponent implements OnInit {
	@Input() public widget: PanelWidgetModel;
	/**
	 * 不显示某一项设置的数组列表
	 * quick： 不启动一键正方形和圆形
	 * bgColor：不启动背景色
	 * radius： 不启动圆角
	 * border: 不启动边框
	 * noneStyle: 不下拉选择无的边框样式
	 */
	@Input() public noSiteList: Array<string> = [];
	@Output() public launchEmitFacadeValueChange: Subject<PanelFacadeModel> = new Subject<PanelFacadeModel>();

	// 边框外观设置的所有值变化可订阅对象
	private panelFacadeValueChangeRX$: Subscription;
	public get panelFacade(): PanelFacadeModel {
		return this.panelWidgetAppearanceService.panelFacadeModel$.value;
	}
	constructor(
		private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService,
		private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService
	) {
		this.panelFacadeValueChangeRX$ = this.panelFacade.valueChange$.pipe(debounceTime(10)).subscribe(value => {
			if (value) {
				// this.handleOnesInsetWidgetFacade()
				this.launchEmitFacadeValueChange.next(this.panelFacade);
			}
		});
	}

	ngOnInit() {}

	ngOnDestroy() {
		if (this.panelFacadeValueChangeRX$) this.panelFacadeValueChangeRX$.unsubscribe();
	}
	ngOnChanges(change: SimpleChanges) {
		if (change.widget) {
			if (this.widget.panelFacadeModel) {
				this.panelFacade.setData(this.widget.panelFacadeModel.getValue());
			}
		}
	}

	/**
	 * 处理只有一个组件的时候的外观设置
	 */
	public handleOnesInsetWidgetFacade(): void {
		const _facade = this.panelFacade;
		let _widget = this.widget;
		const _text = _widget.panelTextModel;
		const _w_height = _widget.conventionSiteModel.height;
		let _all_style = {
			..._facade.styleContent(),
			"line-height": _text.styleContent(
				_w_height - (_facade.borderStyle != "none" ? _facade.borderNumber * 2 : 0)
			)["line-height"]
		};
		_widget.addStyleToUltimatelyStyle(_all_style);
		_widget.panelFacadeModel.setData(_facade.getValue());
	}

	/**
	 * 接收边框的联动按钮选项
	 */
	public acceptLinkageTag(bool: boolean): void {
		const _facade = this.panelFacade;
		_facade.isRadiusAssociated = bool;
		if (bool == true) {
			const _max_radius = Math.max(_facade.ltRadius, _facade.rtRadius, _facade.lbRadius, _facade.rbRadius);
			_facade.setData({
				ltRadius: _max_radius,
				rtRadius: _max_radius,
				lbRadius: _max_radius,
				rbRadius: _max_radius
			});
		}
	}

	/**
	 * 接收圆角的四个角度值的变化
	 */
	public acceptFourRadiusChange(number: number): void {
		const _facade = this.panelFacade;
		if (_facade.isRadiusAssociated == true) {
			_facade.setData({
				ltRadius: number,
				rtRadius: number,
				lbRadius: number,
				rbRadius: number
			});
		}
	}

	/**
	 * 一键正方形
	 */
	public quickSquare(): void {
		this.panelFacade.isRadiusAssociated = true;
		let _widget = this.widget;
		const _max = Math.max(_widget.conventionSiteModel.height, _widget.conventionSiteModel.width);
		_widget.panelFacadeModel.setData({
			ltRadius: 0,
			rtRadius: 0,
			lbRadius: 0,
			rbRadius: 0
		});
		_widget.addStyleToUltimatelyStyle({
			width: `${_max}px`,
			height: `${_max}px`,
			"border-radius": "0px"
		});
		_widget.profileModel.setData({
			width: _max,
			height: _max
		});
		this.acceptFourRadiusChange(0);
		this.panelScopeEnchantmentService.handleFromWidgetListToProfileOuterSphere({
			isLaunch: false
		});
	}

	/**
	 * 一键圆形
	 */
	public quickRound(): void {
		this.panelFacade.isRadiusAssociated = true;
		let _max_f = 0;
		let _widget = this.widget;
		const _max = Math.max(_widget.conventionSiteModel.height, _widget.conventionSiteModel.width);
		_max_f = Math.max(_max, _max_f);
		_widget.panelFacadeModel.setData({
			ltRadius: Math.ceil(_max / 2),
			rtRadius: Math.ceil(_max / 2),
			lbRadius: Math.ceil(_max / 2),
			rbRadius: Math.ceil(_max / 2)
		});
		_widget.addStyleToUltimatelyStyle({
			width: `${_max}px`,
			height: `${_max}px`,
			"border-radius": _widget.panelFacadeModel.styleContent()["border-radius"]
		});
		_widget.profileModel.setData({
			width: _max,
			height: _max
		});
		this.acceptFourRadiusChange(_max_f);
		this.panelScopeEnchantmentService.handleFromWidgetListToProfileOuterSphere({
			isLaunch: false
		});
	}

	/**
	 * 设定背景色为透明
	 */
	public bgTransparent(): void {
		this.panelFacade.setData({
			bgColor: "transparent"
		});
	}
}
