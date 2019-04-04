import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { PanelWidgetModel } from "../../model";
import { get } from "lodash";
import { VesselStatusCollectionModel } from "app/panel-extend/panel-senior-vessel-edit/model";
import { PanelSeniorVesselEditService } from "app/panel-extend/panel-senior-vessel-edit/panel-senior-vessel-edit.service";
import { BehaviorSubject } from "rxjs";
import { PanelExtendService } from "app/panel-extend/panel-extend.service";

@Component({
	selector: "app-senior-vessel-widget",
	templateUrl: "./senior-vessel-widget.component.html",
	styleUrls: ["./senior-vessel-widget.component.scss"]
})
export class SeniorVesselWidgetComponent implements OnInit, OnChanges {
	private _widget: PanelWidgetModel;

	@Input()
	public get widget(): PanelWidgetModel {
		return this._widget;
	}
	public set widget(v: PanelWidgetModel) {
		this._widget = v;
	}

	public get statusWarehouseCollection(): VesselStatusCollectionModel[] {
		return get(this.widget, "autoWidget.content.vesselWidget.statusWarehouseCollection", []) || [];
	}

	// 需要在视图当中显示内部组件的列表
	public vesselInWidgetList$: BehaviorSubject<PanelWidgetModel[]> = new BehaviorSubject([]);

	constructor(
		private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService,
		private readonly panelExtendService: PanelExtendService
	) {}

	ngOnInit() {}

	ngOnChanges(change: SimpleChanges) {
		if (change.widget && change.widget.currentValue) {
			const _current_status = get(
				change.widget.currentValue,
				"autoWidget.content.vesselWidget.currentStatusId",
				""
			);
			const _repertory = get(
				change.widget.currentValue,
				"autoWidget.content.vesselWidget.repertoryStatusWarehouse",
				""
			);
			if (_repertory[_current_status] && Array.isArray(_repertory[_current_status].widgetList)) {
				this.vesselInWidgetList$.next(
					this.panelExtendService.handleFreeItemToPanelWidget(_repertory[_current_status].widgetList)
				);
			}
		}
	}
}
