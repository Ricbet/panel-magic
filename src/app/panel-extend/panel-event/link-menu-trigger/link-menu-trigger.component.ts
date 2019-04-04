import { Component, OnInit, Input, OnDestroy, Output } from "@angular/core";
import { PanelWidgetModel } from "app/panel-extend/panel-widget/model";
import { PanelEventService } from "../panel-event.service";
import { HostItemModel } from "app/panel-extend/panel-widget/model/host.model";
import { WidgetModel, ICustomfeature } from "app/panel-extend/panel-widget/model/widget.model";
import { cloneDeep } from "lodash";
import { Subscription, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { get } from "lodash";
import { EventModel } from "../event-handler";

@Component({
	selector: "app-link-menu-trigger",
	templateUrl: "./link-menu-trigger.component.html",
	styleUrls: ["./link-menu-trigger.component.scss"]
})
export class LinkMenuTriggerComponent implements OnInit, OnDestroy {
	private _eventTarget: Object;
	private isVisibleEventModal$: Subscription;

	@Input()
	public set eventTarget(v: Object) {
		this._eventTarget = v;
		this.conversionPanelWidgetModel(this.eventTarget);
	}
	public get eventTarget(): Object {
		return this._eventTarget;
	}

	@Output() public launchEventHandler: Subject<string> = new Subject<string>();

	@Output() public launchEventParams: Subject<any> = new Subject<any>();

	public get currentPanelWidgetModel(): PanelWidgetModel {
		return this.panelEventService.currentPanelWidgetModel;
	}

	// 当前选中的且有点击事件的eventHandler名称
	public get currentEventTargetEventHandler(): EventModel {
		return this.eventTarget && get(this.eventTarget, "panelEventHandlerModel")
			? (<PanelWidgetModel>this.eventTarget).panelEventHandlerModel
			: new EventModel();
	}

	// 当前是否有事件eventHandler
	public get isEventHandler(): boolean {
		return this.currentEventTargetEventHandler.eventHandler ? true : false;
	}

	constructor(private readonly panelEventService: PanelEventService) {
		this.isVisibleEventModal$ = this.panelEventService.eventSiteModel.isVisibleModal$
			.pipe(debounceTime(1))
			.subscribe(b => {
				if (!b && this.isEventHandler) {
					console.log(this.eventTarget, "curren");
					this.handleOutputAllData();
				}
			});
	}

	ngOnInit() {}

	ngOnDestroy() {
		if (this.isVisibleEventModal$) this.isVisibleEventModal$.unsubscribe();
	}

	/**
	 * 处理output
	 */
	public handleOutputAllData(): void {
		const _current_panel_widget = <PanelWidgetModel>this.eventTarget;
		const _event_handler = _current_panel_widget.panelEventHandlerModel.eventHandler;
		const _event_params = _current_panel_widget.panelEventHandlerModel.eventParams;
		this.launchEventHandler.next(_event_handler);
		this.launchEventParams.next(_event_params);
	}

	/**
	 * 转化为PanelWidgetModel数据
	 */
	public conversionPanelWidgetModel(data: Object): void {
		data = cloneDeep(data);
		const _event_handler = (<ICustomfeature>data).eventHandler;
		const _event_params = (<ICustomfeature>data).eventParams;
		const _panel_widget = new PanelWidgetModel(<HostItemModel>{
			autoWidget: <WidgetModel>{
				customfeature: {
					eventHandler: _event_handler,
					eventParams: _event_params
				}
			}
		});
		this._eventTarget = _panel_widget;
	}

	/**
	 * 点击添加事件
	 */
	public addOnEvent(): void {
		this.panelEventService.currentPanelWidgetModel = <PanelWidgetModel>this.eventTarget;
		this.panelEventService.openEventEntranceSite();
	}

	/**
	 * 删除事件
	 */
	public delCurrentEvent(): void {
		(<PanelWidgetModel>this.eventTarget).panelEventHandlerModel.reset();
		this.handleOutputAllData();
	}
}
